import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
    // 1.设置默认属性和初始状态
    static defaultProps = {
        name: '珠峰架构'
    }
    constructor(props) {
        super(props);
        this.state = { number: 0 }; // 设置默认状态
        console.log('Counter 1.constructor');
    }
    componentWillMount() {
        console.log('Counter 2.componentWillmount');
    }
    handleClick = (event) => {
        this.setState({number: this.state.number + 1})
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        console.log('Counter 5.shouldComponentUpdate');
        // 奇数不更新，偶数更新
        return nextState.number % 2 === 0;
    }
    componentWillUpdate = (prevProps, prevState) => {
        console.log('Counter 6.componentWillUpdate')
    }
    componentDidUpdate = (prevProps, prevState) => {
        console.log('Counter 7.componentDidUpdate')
    }
    
    
    render() {
        console.log('Counter 3.render');
        return <div>
            <div>{this.state.number}</div>
            <button onClick={this.handleClick}>+</button>
        </div>
    }
    componentDidMount () {
        console.log('Counter 4.componentDidMount');
    }
    
}

ReactDOM.render(
    <Counter />, document.getElementById('root')
)