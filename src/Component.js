import ReactDOM from './react-dom'
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
        this.updateComponent();
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
