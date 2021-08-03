import React from './react';
import ReactDOM from './react-dom';

/**
 * 函数组件其实就是一个接收属性对象并返回一个React元素的函数
 * 组件名称必须以答谢字母开头，原生组件span h1是以小写字母开头的，自定义组件是以大写字母开头的
 * 组件必须先定义再使用
 * 组件必须返回唯一的根元素，并且只能返回一个唯一的根元素
 * 组件返回的可能是一个原生的组件元素，也可以是一个函数组件的元素
 * 组件可以接收属性对象，用来计算返回的元素
 * @param {*} props 
 * @returns 
 */
function FunctionComponent2(props) {
    return <h1>{props.title}</h1>
}
function FunctionComponent(props) {
    return <FunctionComponent2 title={props.title + "FunctionComponent"}/>;
}

// let element = <FunctionComponent title={"标题"} />
let element = React.createElement(FunctionComponent, {title: "标题"})

ReactDOM.render(
    element,
    document.getElementById('root')
  );
