const fs = require('fs').promises;

function* read() {
  const data0 = yield fs.readFile('./test/a.txt', 'utf8');
  const data1 = yield fs.readFile(data0, 'utf8');
  return data1;
}

function co(it) {
  return new Promise((resolve, reject) => {
    function next(param) {
      let { value, done } = it.next(param);
      if (done) {
        resolve(value)
      } else {
        Promise.resolve(value).then(next, reject);
      }
    }
    next();
  })
}

co(read()).then((reuslt) => {
  console.log(reuslt)
})