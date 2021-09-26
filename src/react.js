import { wrapToVdom } from './utils';
import Component from './Component';
import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_FRAGMENT, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO } from './constants';
import { shallowEquals } from './utils';
import { useState, useMemo, useCallback } from './react-dom';

/**
 * 创建一个虚拟DOM，也就是React元素
 * @param {*} type 元素的类型span div p
 * @param {*} config 配置对象 classname style
 * @param {*} children 儿子，有可能独生子(对象),也可能是多个(数组)
 */
function createElement(type, config, children) {
    let ref; // 可以通过ref引用此元素
    let key; // 可以唯一标识一个子元素
    if (config) {
        delete config.__source;
        delete config.__self;
        ref = config.ref;
        key = config.key;
        delete config.ref;
        delete config.key;
    }
    let props = { ...config }; // props里没有key的
    if (arguments.length > 3) {
        props.children = (Array.prototype.slice.call(arguments, 2)).map(wrapToVdom);
    } else {
        props.children = wrapToVdom(children); // children可能是React元素对象，也可能是一个字符串 数字 null undefined
    }
    return { $$typeof: REACT_ELEMENT, type, ref, key, props }
}

function createRef() {
    return { current: null }
}

function forwardRef(render) {
    return {
        $$typeof: REACT_FORWARD_REF,
        render // 函数组件
    }
}

function createContext() {
    let context = { $$typeof: REACT_CONTEXT, _currentValue: null };
    context.Provider = {
        $$typeof: REACT_PROVIDER,
        _context: context
    }
    context.Consumer = {
        $$typeof: REACT_CONTEXT,
        _context: context
    }
    return context;
}

class PureComponent extends Component {
    shouldComponentUpdate = (nextProps, nextState) => {
        // 只要属性和状态对象，有任意一个属性变了，就会进行更新，如果全相等，才不更新
        return !shallowEquals(this.props, nextProps) || !shallowEquals(this.state, nextState)
    }
}

function memo(type, compare = shallowEquals) {
    return {
        $$typeof: REACT_MEMO,
        type, // 函数组件
        compare
    }
}

const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    Fragment: REACT_FRAGMENT,
    createContext,
    PureComponent,
    memo,
    useState,
    useMemo,
    useCallback,
}

export default React;