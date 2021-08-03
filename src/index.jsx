import React from './react';
import ReactDOM from './react-dom';
// React.createElemnet会返回一个React元素
// React元素其实是一个普通的JS对象，它描述了你将要在屏幕上看到的内容，它也就是我们常说的虚拟DOM
// babel并没有把JSX编译成蓄力DOM，而是把JSX编译成了React.createElement的方法调用，在浏览器执行时才会被执行React.createElement,然后生成虚拟DOM
// let element1 = <h1 className="title" style={{ color: 'red' }}>hello<span>world</span></h1>
let element2 = React.createElement("h1", {
    className: "title",
    style: {
        color: 'red'
    }
}, "hello", React.createElement("span", null, "world"))
console.log(JSON.stringify(element2, null, 2));
// ReactDOm.render会负责渲染，把React原属渲染到DOM容器内（root）
ReactDOM.render(
    element2,
    document.getElementById('root')
  );

/*  {
    "type": "h1",
    "props": {
      "className": "title",
      "style": {
        "color": "red"
      },
      "children": [
        "hello",
        {
          "type": "span",
          "props": {
            "children": "world"
          }
        }
      ]
    }
  }

  */