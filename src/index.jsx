import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 比如说我们有一个组件是第三房提供的，我们不能改，也不能继承，但是还是想做一些修改或者说增强
 */
class Button extends React.Component {
  constructor(props) {
    super(props);
    //此处的this就是子类的实例
    this.state = {name: '章三'}
    console.log('Button constructor')
  }
  
  componentDidMount() {
    console.log('Button componentDidMount');
  }
  render() {
    console.log('Button render');
    return <button name={this.state.name} title={this.props.title} />
  }
}

const wrapper = OldComponent => {
  return class extends OldComponent {
    constructor(props) {
      super(props);
      console.log(this.state);
      this.state = {number: 0};
      console.log('wrapper constructor')
    }

    handleClick = () => {
      this.setState({number:this.state.number + 1});
    }

    componentDidMount() {
      console.log('wrapper componentDidMount');
      super.componentDidMount();
    }
    
    render() {
      console.log("wrapper render");
      // 调用父亲=类的render方法，返回一个虚拟DOM
      let renderVdom = super.render(); // <button name={this.state.name} title={this.props.title} />
      let newProps = {
        ...renderVdom.props, // {name:undefined, title:'标题'} name为undefiend是因为子类的this.state从{name: '章三'}变成了{number: 0};
        ...this.state, // {number: 0}
        onClick: this.handleClick
      }
      return React.cloneElement(renderVdom, newProps, this.state.number, 'ok');// renderVdom老的属性对象，newProps新的属性对象，this.state.number：儿子
    }
  }
}
let WrappedButton = wrapper(Button);

ReactDOM.render(<WrappedButton title="标题"/>, document.getElementById('root'));

/**
 * super
 */