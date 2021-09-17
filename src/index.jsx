import React from './react';
import ReactDOM from './react-dom';
class Counter extends React.Component {
  //1.设置默认属性和初始状态 
  static defaultProps = {
    name: '珠峰架构'
  }
  constructor(props) {
    super(props);
    this.state = { number: 0 };//设置默认状态
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 });
  }
  render() {
    return (
      <div id={`div${this.state.number}`}>
        <p>{this.state.number}</p>
        <ChildCounter count={this.state.number} />
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
class ChildCounter extends React.Component {
    state = {
        number: 0
    } 
    static getDerivedStateFromProps(nextProps, prevState) {
        const { count } = nextProps;
        if (count % 2 === 0) {
            console.log(`偶数*2=${count*2}`)
            return { number: count * 2 };
        } else if (count % 3 === 0) {
            console.log(`其他*3=${count*3}`)
            return { number: count * 3 };
        } else {
          return null; // 不改状态
        }
    }
    render() {
        return (
            <div>{this.state.number}</div>
        )
    }
}
ReactDOM.render(
  <Counter />, document.getElementById('root')
);

/**
 * React17 domdiff会用到链表
 * getDerivedStateFromProps这个生命周期主要是那种情况下用到呢
 * // 如果组件收到了新的属性，可能会修改自己的状态
 * componentWillReceieProps() {
 *  setState(); 很容易引起死循环
 * }
 */