import { REACT_TEXT } from './constants';
import Event from './event';
/**
 * 把虚拟DOM变成真是DOM插入到容器内部
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
    mount(vdom, container);
}

function mount(vdom, container) {
    let newDOM = createDOM(vdom);
    if (newDOM) {
        container.appendChild(newDOM);
    }
}

/**
 * 把虚拟DOM转化成真实DOM
 * @param {*} vdom 
 */
function createDOM(vdom) {
    if (!vdom) return null;
    let { type, props } = vdom;
    let dom; // 真实DOM
    if (type === REACT_TEXT) { // 如果这个元素是一个文本的话
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
    let renderVdom = type(props);
    // 这个代码我们现在还没有用，后面进行组件更新使用的
    vdom.oldRendervdom = renderVdom;
    return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
    const { type: ClassComponent, props } = vdom;
    let classInstance = new ClassComponent(props);
    let renderVdom = classInstance.render();
    classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
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
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function compareTwoVdom(oldVdom, newVdom) {
    // 获取 oldVdom对应的真实DOM
    let oldDOM = findDOM(oldVdom);
    // 父节点
    let parentDOM = oldDOM.parentNode;
    // 根据新的虚拟DOM得到新的真实DOM
    let newDOM = createDOM(newVdom);
    // 把老得真实DOM替换成新的真实DOM replaceChild原生的DOM操作
    parentDOM.replaceChild(newDOM, oldDOM);
}


const ReactDOM = {
    render,
    findDOM,
    createDOM,
    compareTwoVdom
}

export default ReactDOM;