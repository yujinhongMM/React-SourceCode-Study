import React from './react';
import ReactDOM from './react-dom';
// 如何获取真实的DOM元素
class Calculate extends React.Component {
    constructor(props) {
        super(props);
        this.aRef = React.createRef(); // {current:null}
        this.bRef = React.createRef(); // {current:null}
        this.resultRef = React.createRef; // {current:null}
    }
    handleDdd = () => {
        let a = this.aRef.current.value;
        let b = this.bRef.current.value;
        this.resultRef.current.value = a + b;
    }
    render() {
        // 如果给一个原生组件添加了一个ref属性，那么当此原生虚拟DOM逐渐变成真实的DOM之后，会把真实的DOM元素赋给this.aRef.current
        return <div>
            <input ref={this.aRef} /> + <input ref={this.bRef} /> <button onClick={this.handleDdd}>=</button> <input ref={this.resultRef} />
            
        </div>
    }
}

ReactDOM.render(
    <Calculate />, document.getElementById('root')
);