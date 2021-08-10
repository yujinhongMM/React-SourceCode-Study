import React from './react';
import ReactDOM from './react-dom';

class ClassCompent extends React.Component {
    constructor(props) {
        super(props); // this.props = props;
        // 只有在构造函数中才直接给this.state赋值
        this.state = { number: 0, age: 10 };
    }
    handleClick = (event) => {
        this.setState({ number: this.state.number + 1 })   
        console.log('%c [ this.state.number1111 ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.state.number)
        this.setState({ number: this.state.number + 1 })   
        console.log('%c [ this.state.number2222 ]', 'font-size:13px; background:yellow; color:#bf2c9f;', this.state.number)
        // event.stopPropagation()
        setTimeout(() => { // 在setTimeout是同步更新的
            this.setState({ number: this.state.number + 1 })  
            console.log('%c [ this.state.number2222 ]', 'font-size:13px; background:blue; color:#bf2c9f;', this.state.number) 
            this.setState({ number: this.state.number + 1 })   
            console.log('%c [ this.state.number2222 ]', 'font-size:13px; background:green; color:#bf2c9f;', this.state.number) 
        }, 1000)
    }
    handleDivClick = () => {
        console.log('%c [ handleDivClick ]', 'font-size:13px; background:red; color:#bf2c9f;')
    }
    render() {
        return <div onClick={this.handleDivClick}>
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


/**
 * setState什么时候是同步的， 什么时候是异步的
 * （1）在React能管辖的地方就是批量异步的，比如事件处理函数，比如生命周期函数异步
 * （2）在React管不到的地方，就是同步的比如setTimeout setInterval 原生事件处理函数
 */

/**
 * 合成事件的作用很多
 * 合成事件的原理是通过事件委托实现的
 * 例如：
 * <button onClick={this.handleClick}>+</button>
 * 要向button上绑定click事件
 * 现在不直接向button上绑定事件了
 * 而是把所有的事件都绑到document上
 * React17以前事件都委托到document上
 * React17之后事件都委托到容器上 <div id="container"></div>
 * 这样在一个页面中就可以存在多个不同的React应用
 * <div id="root1"> ReactDOM.render(<h1>, root1);
 * <div id="root2"> ReactDOM.render(<h2>, root2);
 * 相当于一个事件委托
 * 
 * 使用事件委托可以实现
 * 1、在事件开始时 加入updateQueue.isBatchingUpdate= true；结束的时候 加入updateQueue.batchUpdate();
 * 2、可以做一些浏览器兼容性处理
 * 不同浏览器API不一样的
 * 把不同的事件对象做成一个标准化的事件对象，提供标准的API访问供用户使用。
 * function stopPropagation(event) {
 *  if (!event) {
 *      window.event.cancelBubble =true;
 *  }
 *  if (event.stopPropagation) {
 *      event.stopPropagation();
 *  }
 * }
 */
