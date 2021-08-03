import React from './react';
import ReactDOM from './react-dom';


class ClassCompent extends React.Component {
    constructor(props) {
        super(props); // this.props = props;
        // 只有在构造函数中才直接给this.state赋值
        this.state = { number: 0, age: 10 };
    }
    handleClick = () => {
        // 可通过setState修改状态，每次修改后，组件会重新刷新
        // this.setState({ number: this.state.number + 1 })
        // 如果你直接修改state的话，this.state的确改变了，但是组件并没有刷新，页面也没有更新，视图不更新
        // this.state.number += 1;
        // console.log(this.state);
        // setState参数是新状态对象，这个新状态对象会合并到老状态对象上。
        // 老状态没有的属性会添加，老状态有的属性会被覆盖
        // state状态的更新是批量的，是异步执行的
        // 先实现同步更新
        this.setState({ number: this.state.number + 1 })   
    }
    render() {
        return <div>
            <p>{this.props.title}</p>
            <p>number:{this.state.number}</p>
            <button onClick={this.handleClick}>+</button>
        </div>
    }
}
let element = React.createElement(ClassCompent, { title: '标ddd题'})
ReactDOM.render(
    element,
    document.getElementById('root')
  );
