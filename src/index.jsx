import React from 'react';
import ReactDOM from 'react-dom';
let ThememContext = React.createContext();

class Header extends React.Component {
  static contextType = ThememContext;
  render() {
    return (
      <div style={{margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px'}}>
        header
        <Title />
      </div>
    )
  }
}

class Title extends React.Component {
  static contextType = ThememContext;
  render() {
    return (
      <div style={{margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px'}}>title</div>
    )
  }
}

class Main extends React.Component {
  static contextType = ThememContext;
  render() {
    return (
      <div style={{margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px'}}>
        main
        <Content />
      </div>
    )
  }
}

class Content extends React.Component {
  static contextType = ThememContext;
  render() {
    return (
      <div style={{margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px'}}>
        content
        <button onClick={() => this.context.changeColor('red')}>红色</button>
        <button onClick={() => this.context.changeColor('green')}>绿色</button>
      </div>
    )
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: 'red'};
  }
  changeColor = (color) => {
    this.setState({color})
  }

  render() {
    let value = {color: this.state.color, changeColor: this.changeColor};
    return (
      <ThememContext.Provider value={value}>
        <div style={{margin: '10px', border: `5px solid ${this.state.color}`, padding: '5px', width:'240px'}}>
          page
          <Header />
          <Main />
        </div>
      </ThememContext.Provider>
    )
  }

}

ReactDOM.render(
  <Page />, document.getElementById('root')
);
