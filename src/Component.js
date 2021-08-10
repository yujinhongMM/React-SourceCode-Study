import ReactDOM from './react-dom'
// 更新队列
export let updateQueue = {
    isBatchingUpdate: false, // 默认值是非批量的，同步的
    updaters: [], // 更新器的数组
    batchUpdate() {
        for (let updater of updateQueue.updaters) {
            updater.updateComponent();
        }
        updateQueue.updaters.length = 0;
        updateQueue.isBatchingUpdate = false;
    }
}
class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance;
        this.pendingStates = []; // 等待生效的数组
    }
    addState(partialState) {
        this.pendingStates.push(partialState);
        this.emitUpdate(); // 触发更新
    }
    emitUpdate() {
        // 有可能是批量更新，也有可能是同步更新
        if (updateQueue.isBatchingUpdate) { // 批量异步更新
            updateQueue.updaters.push(this); // 不刷新组件视图了，只是把自己这个updater实例添加到updateQueue等待生效
        } else { // 同步直接更新
            this.updateComponent();
        }
    }
    updateComponent() {
        const { classInstance, pendingStates } = this;
        if (pendingStates.length > 0) {
            this.shouldUpdate(classInstance, this.getState());
        }
    }
    getState() {
        const { classInstance, pendingStates } = this;
        let { state } = classInstance; // 老状态
        pendingStates.forEach((partialState) => { // 和每个分状态
            if (typeof partialState === 'function') {
                partialState = partialState(state);
            }
            state = { ...state, ...partialState }
        })
        pendingStates.length = 0; // 清空等待生效状态的数组
        return state;
    }
    shouldUpdate(classInstance, nextState) {
        classInstance.state = nextState; // 先把新状态赋值给实例的state
        classInstance.forceUpdate(); // 强制更新
    }
}

class Component {
    static isReactComponent = true; // 当子类继承父类的时候，父类的静态属性也是可以继承的
    constructor(props) {
        this.props = props;
        this.state = {};
        this.updater = new Updater(this);
    }
    setState(partialState) {
        this.updater.addState(partialState);
    }
    // 根据新的属性状态计算新的要渲染的虚拟DOM
    forceUpdate() {
        let oldRenderVdom = this.oldRenderVdom; // 上一次类组件render计算得到的虚拟DOM
        // 然后基于新的属性和状态，计算新的虚拟DOM
        let newRenderVdom = this.render();
        ReactDOM.compareTwoVdom(oldRenderVdom, newRenderVdom);
        this.oldRenderVdom = newRenderVdom;
    }
}


export default Component;
