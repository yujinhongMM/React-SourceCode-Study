import React from './react';
import ReactDOM from './react-dom';

function FunctionComponent(props) {
    return <h1>{props.title}FunctionComponent</h1>
}
/**
 * 也可以通过类定义组件
 * 类组件的渲染是通过 先通过属性对象创建类组件的实例，调用实例的render方法返回一个React元素
 */
class ClassCompent extends React.Component {
    constructor(props) {
        super(props); // this.props = props;
    }
    render() {
        return <FunctionComponent title={this.props.title + "|ClassCompent|"}/>
    }
}
let element = React.createElement(ClassCompent, { title: '标ddd题'})
ReactDOM.render(
    element,
    document.getElementById('root')
  );
