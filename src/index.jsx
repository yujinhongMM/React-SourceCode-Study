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
    console.log('Counter 1.constructor');
  }
  componentWillMount() {
    console.log('Counter 2.componentWillMount');
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 });
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate');
    //奇数不更新，偶数更新
    return nextState.number % 2 === 0;
  }
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate');
  }
  render() {
    console.log('Counter 3.render');
    return (
      <div id={`div${this.state.number}`}>
        <p>{this.state.number}</p>
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate');
  }
  componentDidMount() {
    console.log('Counter 4.componentDidMount');
  }
}
class ChildCounter extends React.Component {
  componentWillUnmount() {
    console.log('ChildCounter 6.componentWillUnmount');
  }
  componentWillMount() {
    console.log('ChildCounter 1.componentWillMount');
  }
  componentDidMount() {
    console.log('ChildCounter 3.componentDidMount');
  }
  componentWillReceiveProps(nextProps) {
    console.log('ChildCounter 4.componentWillReceiveProps');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter 5.shouldComponentUpdate');
    //只有属性中有count值是3的倍数的话才更新，否则不更新
    //0 3 6 9更新，其它的数不更新
    return nextProps.count % 3 === 0;
  }
  render() {
    console.log('ChildCounter 2.render');
    return (
      <div>
        {this.props.count}
      </div>
    )
  }
}
ReactDOM.render(
  <Counter />, document.getElementById('root')
);
/**
Counter 1.constructor
Counter 2.componentWillMount
Counter 3.render
ChildCounter 1.componentWillMount
ChildCounter 2.render
ChildCounter 3.componentDidMount
Counter 4.componentDidMount

点击一次，这个时候父组件Counter.state.number=1
奇数不更新，偶数更新
Counter 5.shouldComponentUpdate


点击第2次，这个时候父组件Counter.state.number=2
偶数要更新
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 4.componentWillReceiveProps  父组件更新的时候 ，要更新子组件，子组件要收到新的属性
ChildCounter 5.shouldComponentUpdate 子组件也判断一下要不要更新
子组件说只有属性中有count值是3的倍数的话才更新，否则不更新，现在是2，不更新，返回值为false
Counter 7.componentDidUpdate


再点第3次这个时候父组件Counter.state.number=3
奇数不更新
Counter 5.shouldComponentUpdate

再点第4次，这个时候父组件Counter.state.number=4
偶数要更新
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render 得到新的虚拟DOM 上一次  p ChildCounter button,这一次p button
ChildCounter 6.componentWillUnmount 子且件将要被卸载
Counter 7.componentDidUpdate 父组件更新完成

再点第5次 这个时候父组件Counter.state.number=5
奇数不更新
Counter 5.shouldComponentUpdate

再点第6次，这个父组件Counter.state.number=6
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 1.componentWillMount 上一次 p button,这一次p ChildCounter button
ChildCounter 2.render
ChildCounter 3.componentDidMount
Counter 7.componentDidUpdate

实现DOM-DIFF
分成两个阶段
第1个阶段就是优化前，直接 按索引比较


 */