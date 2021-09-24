import React from './react';
import ReactDOM from './react-dom';

function Counter(props) {
  const [number1, setNumber1] = React.useState(0);
  const [number2, setNumber2] = React.useState(0);

  let handleClick1 = () => setNumber1(number1 + 1);
  let handleClick2 = () => setNumber2(number2 + 2);
  return (
    <div>
      <p>{number1}</p>
      <p>{number2}</p>
      <button onClick={handleClick1}>+</button>
      <button onClick={handleClick2}>+</button>
    </div>
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'));
