import React from './react';
import ReactDOM from './react-dom';

// 1、加上依赖空数组 定时器只执行一次
function Counter() {
  const [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log('开启定时器');
    const timer = setInterval(() => {
      setNumber(number => number + 1);
    }, 1000)
  }, []);
  return <div>{number}</div>
}

// 2、可在下一次执行effect的这之前清楚上一个定时器
// function Counter() {
//   const [number, setNumber] = React.useState(0);
//   React.useEffect(() => {
//     console.log('开启定时器');
//     const timer = setInterval(() => {
//       console.log('执行定时器');
//       setNumber(number => number + 1);
//     }, 1000)
//     return () => {
//       console.log("销毁定时器");
//       clearInterval(timer)
//     }
//   });
//   return <div>{number}</div>
// }
ReactDOM.render(<Counter />, document.getElementById('root'));
