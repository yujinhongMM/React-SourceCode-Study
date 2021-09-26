let fs = require('fs').promises;
// let co = require('co')
function * readAge(filePath) {
  let name = yield fs.readFile(filePath, "utf-8");
  let age = yield fs.readFile(name, 'utf-8');
  return age;
}

function co(it) {
  return new Promise((resolve, reject) => {
    // 递归 异步迭代（函数来迭代） 同步就是forEach Promise.all
    function next(val) {
      let { value, done } = it.next(val);
      if (done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(data => {
          next(data);
        })
      }
    }
    next();
  })
}

co(readAge('./test/name.txt')).then(data => {
  console.log(data)
})

// let it = readAge('./test/name.txt');
// let {value, done} = it.next();
// console.log(value, done)