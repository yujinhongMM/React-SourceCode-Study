import React from './react';
import ReactDOM from './react-dom';

function TextInput(props, forwardRef) {
    return <input ref={forwardRef} />
} 

const ForwardedTextInput = React.forwardRef(TextInput);
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    getFocus = (event) => {
        // 如果给一个类组件添加了ref属性，那么ref.current会指向类组件的实例
        this.inputRef.current.focus();
    }
    render() {
        return(
            <div>
                <ForwardedTextInput ref={this.inputRef} />
                <button onClick={this.getFocus}>输入框获得焦点</button>
            </div>
        )
    }
}

ReactDOM.render(
    <Form />, document.getElementById('root')
)