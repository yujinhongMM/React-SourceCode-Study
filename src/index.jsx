import React from './react';
import ReactDOM from './react-dom';

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
  }
  componentWillUnmount() {
    document.body.removeChild(this.node);
  }
  
  render() {
    // 把一个JSX，也就是一个虚拟DOM元素渲染到对应的DOM节点中
    return ReactDOM.createPortal(
      <div className="dialog">
        {this.props.children}
      </div>,
      this.node
    )
  }
}
class App extends React.Component {
  render() {
    return(
      <div>
         <Dialog>模态窗口</Dialog>
      </div>
    )
  } 
}
ReactDOM.render(<App />, document.getElementById('root'));
