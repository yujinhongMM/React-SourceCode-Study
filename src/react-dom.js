import { REACT_TEXT, REACT_FORWARD_REF, REACT_FRAGMENT, MOVE, PLACEMENT } from './constants';
import Event from './event';
/**
 * 把虚拟DOM变成真是DOM插入到容器内部
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
    mount(vdom, container);
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
    if (type && type.$$typeof === REACT_FORWARD_REF) {
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
    childrenVdom.forEach(childVdom => mount(childVdom, parentDOM));
}

function mountFunctionComponent(vdom) {
    const { type, props } = vdom;
    // 这里的type就是传入的函数
    let oldRendervdom = type(props);
    // 这个代码我们现在还没有用，后面进行组件更新使用的
    vdom.oldRendervdom = oldRendervdom;
    return createDOM(oldRendervdom);
}

function mountClassComponent(vdom) {
    const { type: ClassComponent, props, ref } = vdom;
    let classInstance = new ClassComponent(props);
    // 如果类组件的虚拟DOM有ref属性，那么就把类的实例赋给ref.current属性
    if (ref) ref.current = classInstance;
    if (classInstance.componentWillMount) { // 组件将要挂载
        classInstance.componentWillMount();
    }
    // 把类组件的实例挂载到它对应的vdom上
    vdom.classInstance = classInstance;
    let renderVdom = classInstance.render();
    classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
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
        return findDOM(vdom.oldRenderVdom);
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
        let newDOM = createDOM(newVdom); // 根据新的虚拟DOM创建新的真实DOM
        parentDOM.appendChild(newDOM); // 添加到父节点上
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
    // 如果新老节点都是纯文本节点的话
    if (oldVdom.type === REACT_TEXT) {
        if (oldVdom.props.content !== newVdom.props.content) {
            let currentDOM = newVdom.dom = findDOM(oldVdom);
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
            newVdom.classInstance = oldVdom.classInstance;
            updateClassComponent(oldVdom, newVdom);
        } else { // 函数组件
            updateFunctionComponent(oldVdom, newVdom);
        }
    }
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
    oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : oldVChildren ? [oldVChildren] : [];
    newVChildren = Array.isArray(newVChildren) ? newVChildren : newVChildren ? [newVChildren] : [];
    let maxChildrenLength = Math.max(oldVChildren.length, newVChildren.length);
    for (let i = 0; i < maxChildrenLength; i++) {
        // 试图取出当前的节点的下一个，最近的弟弟真实DOM节点
        let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item))
        compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], findDOM(nextVdom));
    }
}

function updateClassComponent(oldVdom, newVdom) {
    let classInstance = newVdom.classInstance = oldVdom.classInstance;
    if (classInstance.componentWillReceiveProps) {
        classInstance.componentWillReceiveProps(newVdom.props);
    }
    classInstance.updater.emitUpdate(newVdom.props);
    newVdom.oldRenderVdom = classInstance.oldRenderVdom; // 是用来找真实DOM时有用
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

const ReactDOM = {
    render,
    findDOM,
    createDOM,
    compareTwoVdom
}

export default ReactDOM;