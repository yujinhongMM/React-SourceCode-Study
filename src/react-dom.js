import { REACT_TEXT } from './constants';

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

const ReactDOM = {
    render
}

export default ReactDOM;