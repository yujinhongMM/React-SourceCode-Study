import { REACT_TEXT, REACT_FORWARD_REF, REACT_FRAGMENT, MOVE, PLACEMENT, DELETION, REACT_CONTEXT, REACT_PROVIDER, REACT_MEMO } from './constants';
import Event from './event';

let scheduleUpdate;
// 这是一个全局变量,用来记录hook的值 注：源码用的链表
let hookState = [];
// 存放当前hook的索引
let hookIndex = 0;

export function useReducer(reducer, initialState) {
    hookState[hookIndex] = hookState[hookIndex] || initialState;
    let currentIndex = hookIndex;
    function dispatch(action) {
        action = typeof action === 'function' ? action(hookState[currentIndex]) : action;
        hookState[currentIndex] = reducer ? reducer(hookState[currentIndex], action) : action;
        scheduleUpdate(); // 状态变化后，要执行调度更新任务
    }
    return [hookState[hookIndex++], dispatch]
}

// useState是一个useReducer的语法糖，是一个简单的实现
export function useState(initialState) {
    return useReducer(null, initialState);
    // hookState[hookIndex] = hookState[hookIndex] || initialState;
    // let currentIndex = hookIndex;
    // function setState(newState) {
    //     hookState[currentIndex] = newState; // currentIndex永远指向hookIndex赋值的时候的那个值
    //     scheduleUpdate(); // 状态变化后，要执行调度更新任务
    // }
    // return [hookState[hookIndex++], setState]
}

export function useEffect(effect, deps) {
    // 先判断是不是初次渲染
    if (hookState[hookIndex]) {
        let [lastDestroy, lastDeps] = hookState[hookIndex];
        let same = deps && deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            hookIndex++;
        } else {
            // 如果有任何一个值不一样，则执行上一个销毁函数
            lastDestroy && lastDestroy();
            // 开启一个新的宏任务
            setTimeout(() => {
                let destroy = effect();
                hookState[hookIndex++] = [destroy, deps];
            });
        }
    } else {
        // 如果是第一次执行的话
        setTimeout(() => {
            let destroy = effect();
            hookState[hookIndex++] = [destroy, deps];
        });
    }
}

/**
 * 可以缓存对象
 * @param {*} factory 可以用来创建对象的工厂方法
 * @param {*} deps 依赖数组
 */
export function useMemo(factory, deps) {
    // 先判断是不是初次渲染
    if (hookState[hookIndex]) {
        let [lastMemo, lastDeps] = hookState[hookIndex];
        let same = deps && deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            hookIndex++;
            return lastMemo;
        } else {
            let newMemo = factory();
            hookState[hookIndex++] = [newMemo, deps];
            return newMemo;
        }
    } else {
        // 说明是初次渲染
        let newMemo = factory();
        hookState[hookIndex++] = [newMemo, deps];
        return newMemo;
    }
}

/**
 * 可以缓存回调函数
 * @param {*} callback 回调函数
 * @param {*} deps 依赖数组
 */
export function useCallback(callback, deps) {
    // 先判断是不是初次渲染
    if (hookState[hookIndex]) {
        let [lastCallback, lastDeps] = hookState[hookIndex];
        let same = deps && deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            hookIndex++;
            return lastCallback;
        } else {
            hookState[hookIndex++] = [callback, deps];
            return callback;
        }
    } else {
        // 说明是初次渲染
        hookState[hookIndex++] = [callback, deps];
        return callback;
    }
}


/**
 * 把虚拟DOM变成真是DOM插入到容器内部
 * @param {*} vdom 虚拟DOM
 * @param {*} parentDOM 容器
 */
function render(vdom, parentDOM) {
    mount(vdom, parentDOM);
    // 在React里不管在哪里出发的更新，真正的调度都是从根节点开始的
    scheduleUpdate = () => {
        hookIndex = 0; // 把索引重置为0
        // 从根节点执行完整的dom-diff，进行组件的更新
        compareTwoVdom(parentDOM, vdom, vdom);
    }
}

function mount(vdom, parentDOM) {
    let newDOM = createDOM(vdom);
    if (newDOM) {
        parentDOM.appendChild(newDOM);
        if (newDOM._componentDidMount) {
            newDOM._componentDidMount();
        }
    }
}

/**
 * 把虚拟DOM转化成真实DOM
 * @param {*} vdom 
 */
function createDOM(vdom) {
    if (!vdom) return null;
    let { type, props, ref } = vdom;
    let dom; // 真实DOM
    if (type && type.$$typeof === REACT_MEMO) {
        return mountMemo(vdom);
    } else if (type && type.$$typeof === REACT_PROVIDER) {
        return mountProvider(vdom);
    } else if (type && type.$$typeof === REACT_CONTEXT) {
        return mountContext(vdom);
    } else if (type && type.$$typeof === REACT_FORWARD_REF) { // 说明它是一个转发过的函数组件
        return mountForwardComponent(vdom);
    } else if (type === REACT_FRAGMENT) { // 说明它是一个文档碎片
        dom = document.createDocumentFragment();
    } else if (type === REACT_TEXT) { // 如果这个元素是一个文本的话
        dom = document.createTextNode(props.content);
    } else if (typeof type === 'function') {
        if (type.isReactComponent) { // 说明它是一个类组件
            return mountClassComponent(vdom);
        } else {
            return mountFunctionComponent(vdom);
        }
    } else {
        dom = document.createElement(type);
    }
    // 处理属性
    if (props) {
        updateProps(dom, {}, props);
        if (props.children) {
            let children = props.children;
            if (typeof children === 'object' && children.type) { // 说明是一个React元素
                children._mountIndex = 0;
                mount(children, dom);
            } else if (Array.isArray(children)) {
                reconcileChildren(props.children, dom);
            }
        }
    }
    vdom.dom = dom; // 让虚拟DOM的dom属性指向这个虚拟DOM对应的真实DOM
    if (ref) {
        ref.current = dom; // 如果把虚拟DOM转成真实DOM，就让ref.current=真实DOM
    }
    return dom;
}

function mountMemo(vdom) {
    // type = {$$typeof: REACT_MEMO,type,compare}
    let { type, props } = vdom; // type.type 函数组件
    let renderVdom = type.type(props);
    vdom.prevProps = props; // 在vdom上记录上一次的属性对象
    vdom.oldRenderVdom = renderVdom; // 用于findDOM
    return createDOM(renderVdom);
}

/**
 * 渲染Provder组件
 * 1、真正要渲染的是它的儿子children
 * 2、把Provider组件自己收到的value属性赋值给context._currentValue
 * @param {*} vdom 
 * @returns 
 */
function mountProvider(vdom) {
    let { type, props, ref } = vdom;
    let context = type._context;
    context._currentValue = props.value;
    let renderVdom = props.children;
    vdom.oldRenderVdom = renderVdom; // 这个操作就是让当前的虚拟DOM的oldRenderVdom指向要渲染的虚拟DOM
    return createDOM(renderVdom);
}


function mountContext(vdom) {
    let { type, props, ref } = vdom;
    let context = type._context;
    let currentValue = context._currentValue;
    let renderVdom = props.children(currentValue);
    vdom.oldRenderVdom = renderVdom; // 这个操作就是让当前的虚拟DOM的oldRenderVdom指向要渲染的虚拟DOM
    return createDOM(renderVdom);
}
/**
 * 把新的属性更新到真实DOM上
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */
function updateProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') {
            continue; // 此处忽略子节点的处理
        } else if (key === 'style') {
            let styleObj = newProps[key];
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        } else if (key.startsWith('on')) {
            // dom[key.toLocaleLowerCase()] = newProps[key];
            Event.addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
        } else {
            dom[key] = newProps[key]; // className
        }
    }
}

/**
 * 处理数组形式的子节点
 * @param {*} childrenVdom 
 * @param {*} parentDOM 
 */
function reconcileChildren(childrenVdom, parentDOM) {
    childrenVdom.forEach((childVdom, index) => {
        childVdom._mountIndex = index;
        mount(childVdom, parentDOM)
    });
}

function mountFunctionComponent(vdom) {
    const { type, props } = vdom;
    // 这里的type就是传入的函数
    let oldRenderVdom = type(props);
    // 这个代码我们现在还没有用，后面进行组件更新使用的
    vdom.oldRenderVdom = oldRenderVdom;
    return createDOM(oldRenderVdom);
}

function mountClassComponent(vdom) {
    const { type: ClassComponent, props, ref } = vdom;
    let classInstance = new ClassComponent(props);
    if (ClassComponent.contextType) {
        classInstance.context = ClassComponent.contextType._currentValue;
    }
    // 如果类组件的虚拟DOM有ref属性，那么就把类的实例赋给ref.current属性
    if (ref) ref.current = classInstance;
    if (classInstance.componentWillMount) { // 组件将要挂载
        classInstance.componentWillMount();
    }
    // 把类组件的实例挂载到它对应的vdom上
    vdom.classInstance = classInstance;
    let renderVdom = classInstance.render();
    classInstance.oldRenderVdom = renderVdom;
    // 把类组件的实例的render方法返回的虚拟dom转换成真实DOM
    let dom = createDOM(renderVdom);
    if (classInstance.componentDidMount) { // 组件已经挂载
        dom._componentDidMount = classInstance.componentDidMount.bind(classInstance);
    }
    return dom;
}

function findDOM(vdom) {
    if (!vdom) return null;
    if (vdom.dom) {
        return vdom.dom;
    } else {
        let renderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom;
        return findDOM(renderVdom);
    }
}
/**
 * dom-diff核心比较新旧虚拟DOM的差异，然后把差异同步到真实DOM节点上
 * @param {*} parentDOM
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
    // 如果老的是null,新的也是null，什么都不用做
    if (!oldVdom && !newVdom) {
        return null;
    } else if (oldVdom && !newVdom) { // 如果老的是虚拟DOM节点，新的是null 卸载老节点
        unMountVdom(oldVdom);
    } else if (!oldVdom && newVdom) { // 如果老的是null，新的是虚拟DOM节点
        let newDOM = createDOM(newVdom); // 根据新的虚拟DOM创建新的真实DOM
        if (nextDOM) {
            parentDOM.insertBefore(newDOM, nextDOM)
        } else {
            parentDOM.appendChild(newDOM)
        }
        if (newDOM._componentDidMount) newDOM._componentDidMount();
    } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) { // 如果老的新的都不是null,但是类型不同
        unMountVdom(oldVdom);
        let newDOM = createDOM(newVdom);//根据新的虚拟DOm创建新的真实DOM
        if (nextDOM) {
            parentDOM.insertBefore(newDOM, nextDOM)
        } else {
            parentDOM.appendChild(newDOM);//添加到父节点上
        }
        if (newDOM._componentDidMount) newDOM._componentDidMount();
    } else { // 如果老得又，新的也有，并且类型也一样，只需要更新就可以，就可以服用老得节点了
        // 进入深度对比子节点的流程
        updateElement(oldVdom, newVdom);
    }
}
/**
 * 深度更新节点
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(oldVdom, newVdom) {
    if (oldVdom.type.$$typeof === REACT_MEMO) {
        updateMemo(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_PROVIDER) { // Provider更新
        updateProvider(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_CONTEXT) { // Consumer更新
        updateContext(oldVdom, newVdom);
    } else if (oldVdom.type === REACT_TEXT) {
        let currentDOM = newVdom.dom = findDOM(oldVdom);
        if (oldVdom.props.content !== newVdom.props.content) {
            currentDOM.textContent = newVdom.props.content; // 更新文本节点的内容为新的文本内容
        }
    } else if (oldVdom.type === REACT_FRAGMENT) {
        let currentDOM = newVdom.dom = findDOM(oldVdom);
        updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    } else if (typeof oldVdom.type === 'string') { // 此节点是原生组件span div之类，而且类型一样，说明可以服用老得dom节点
        let currentDOM = newVdom.dom = findDOM(oldVdom); // 获取老得真实DOM，准备复用
        updateProps(currentDOM, oldVdom.props, newVdom.props); // 直接用新的属性更新老的DOM节点即可
        updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    } else if (typeof oldVdom.type === 'function') {
        if (oldVdom.type.isReactComponent) { // 类组件
            updateClassComponent(oldVdom, newVdom);
        } else { // 函数组件
            updateFunctionComponent(oldVdom, newVdom);
        }
    }
}

function updateMemo(oldVdom, newVdom) {
    let { type, prevProps } = oldVdom;
    // 比较结果相等，就不需要渲染了 render 
    let renderVdom = oldVdom.oldRenderVdom;
    if (!type.compare(prevProps, newVdom.props)) {
        let currentDOM = findDOM(oldVdom);
        let parentDOM = currentDOM.parentNode;
        let { type, props } = newVdom;
        renderVdom = type.type(props);
        compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    }
    newVdom.prevProps = newVdom.props;
    newVdom.oldRenderVdom = renderVdom;
}

/**
 * 实现完整的DOM-DIFF算法
 * @param {*} parentDOM 父DOM节点
 * @param {*} oldVChildren 老的虚拟DOM儿子的数组
 * @param {*} newVChildren 新的虚拟DOM儿子的数组
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
    oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : oldVChildren ? [oldVChildren] : [];
    newVChildren = Array.isArray(newVChildren) ? newVChildren : newVChildren ? [newVChildren] : [];
    let keyedOldMap = {};
    let lastPlacedIndex = 0; // 上一个不需要移动的老DOM节点的索引
    oldVChildren.forEach((oldVChild, index) => {
        let oldKey = oldVChild.key || index; // 如果提供了key，会使用key作为唯一表示，如果没有提供，会使用索引
        keyedOldMap[oldKey] = oldVChild;
    })
    // 存着将要进行的操作
    let patch = [];
    // 循环新数组
    newVChildren.forEach((newVChild, index) => {
        newVChild._mountIndex = index; // 设置虚拟DOM的挂载索引index
        let newKey = newVChild.key || index;
        let oldVChild = keyedOldMap[newKey];
        if (oldVChild) {
            // 如果找到了，按理应该在此判断类型。
            // 先执行更新虚拟DOM元素 在React15里， DOM的更新和DOM-DIFF放在一起进行的
            updateElement(oldVChild, newVChild);
            if (oldVChild._mountIndex < lastPlacedIndex) {
                patch.push({
                    type: MOVE,
                    oldVChild,
                    newVChild,
                    fromIndex: oldVChild._mountIndex,
                    toIndex: index
                })
            }
            // 如果此节点被复用了，就把它从map中删除
            delete keyedOldMap[newKey];
            lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild._mountIndex);
        } else {
            // 没有找到可复用的老节点
            patch.push({
                type: PLACEMENT,
                newVChild,
                toIndex: index
            })
        }
    })
    /* Object.values(keyedOldMap).forEach(oldVChild => {
        patch.push({
            type: DELETION,
            oldVChild
        })
    })
    if (patch.length > 0) {
        console.log('%c [ patch ]', 'font-size:13px; background:pink; color:#bf2c9f;', patch)
    } */
    // 获取要移动的元素 这里面现在只有B
    // 此处我只是把B从界面中移除了，但是B还是在内存里的，B这里的没有被销毁
    const moveChilds = patch.filter(action => action.type === MOVE).map(action => action.oldVChild)
    Object.values(keyedOldMap).concat(moveChilds).forEach(oldVChild => {
        let currentDOM = findDOM(oldVChild);
        // 获取到BDF三个的真实DOM元素，然后从界面中删除
        currentDOM.parentNode.removeChild(currentDOM);
    })
    patch.forEach(action => {
        let { type, oldVChild, newVChild, toIndex } = action;
        let childNodes = parentDOM.childNodes; // 获取真实的子DOM元素的集合[A,C,E]
        if (type === PLACEMENT) {
            let newDOM = createDOM(newVChild); // 根据虚拟DOM创建真实DOM
            let childDOMNode = childNodes[toIndex]; // 找一下目标索引现在对应的真实DOM元素
            if (childDOMNode) { // 如果此位置上已经有DOM元素，插入到它前面
                parentDOM.insertBefore(newDOM, childDOMNode);
            } else {
                parentDOM.appendChild(newDOM); // 添加到最后就可以了
            }
        } else if (type === MOVE) {
            let oldDOM = findDOM(oldVChild); // 找到老的真实DOM，还可以在内存中把B取到，插入到指定的位置
            let childDOMNode = childNodes[toIndex]; // 找一下目标索引现在对应的真实DOM元素
            if (childDOMNode) { // 如果此位置上已经有DOM元素，插入到它前面
                parentDOM.insertBefore(oldDOM, childDOMNode);
            } else {
                parentDOM.appendChild(oldDOM); // 添加到最后就可以了
            }
        }
    })


}

function updateClassComponent(oldVdom, newVdom) {
    let classInstance = newVdom.classInstance = oldVdom.classInstance;
    if (classInstance.componentWillReceiveProps) {
        classInstance.componentWillReceiveProps(newVdom.props);
    }
    classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
    let currentDOM = findDOM(oldVdom);
    let parentDOM = currentDOM.parentNode;
    let { type, props } = newVdom;
    let newRenderVdom = type(props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
    newVdom.oldRenderVdom = newRenderVdom;
}

function unMountVdom(vdom) {
    let { props, ref } = vdom;
    let currentDOM = findDOM(vdom); // 获取此虚拟DOM对应的真实DOM
    // vdom可能是原生组件span 类组件 classComponent 也可能是函数组件Function
    if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
        vdom.classInstance.componentWillUnmount();
    }
    if (ref) {
        ref.current = null;
    }
    // 取消监听函数
    Object.keys(props).forEach(propName => {
        if (propName.slice(0, 2) === 'on') {
            if (currentDOM) delete currentDOM._store
        };
    })
    if (props.children) {
        // 得到儿子的数组
        let children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(unMountVdom);
    }
    // 把自己这个虚拟DOM对应的真实DOM从界面中删除
    if (currentDOM) currentDOM.parentNode.removeChild(currentDOM);
}

function mountForwardComponent(vdom) {
    let { type, props, ref } = vdom;
    let renderVdom = type.render(props, ref);
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}


function updateProvider(oldVdom, newVdom) {
    let currentDOM = findDOM(oldVdom);// <div style={{margin:'10px'
    let parentDOM = currentDOM.parentNode;// div#root
    let { type, props } = newVdom;// type ={$$typeof:REACT_PROVIDER,_context:context }
    let context = type._context;
    context._currentValue = props.value;// 给context赋上新的_currentValue
    let renderVdom = props.children;
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}

function updateContext(oldVdom, newVdom) {
    let currentDOM = findDOM(oldVdom);//<div style={{margin:'10px'
    let parentDOM = currentDOM.parentNode;//div#root
    let { type, props } = newVdom;//type ={$$typeof:REACT_PROVIDER,_context:context }
    let context = type._context;
    let renderVdom = props.children(context._currentValue);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}

const ReactDOM = {
    render,
    findDOM,
    createDOM,
    compareTwoVdom,
    createPortal: render,
}

export default ReactDOM;