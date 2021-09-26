const util = require('util');
const fs = require('fs').promises;

// async function read() {
//   let data = await fs.readFile('./20210404/a.txt', 'utf8');
//   data = await fs.readFile(data, 'utf8');
//   console.log('xxxx');
//   return data;
// }
// read().then(data => {
//   console.log(data);
// })

function* read() {
  let data = yield fs.readFile('./20210404/a.txt', 'utf8');
  data = fs.readFile(data, 'utf-8');
  console.log('xxxx');
  return data;
}

function co(it) {
  return new Promise((resolve, reject) => {
    // 异步的迭代，只能用递归的方法
    function next(data) {
      let { value, done } = it.next(data);
      if (done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(next, reject);
      }
    }
    next();
  })
}

co(read()).then(res => {
  console.log(res)
})


// function co(it) {
//   return new Promise((resolve, reject) => {
//     // 异步的迭代 只能用递归的方法
//     function next(data) {
//       let { value, done } = it.next(data);
//       if (done) {
//         resolve(value);
//       } else {
//         Promise.resolve(value).then(next, reject);
//       }
//     }
//     next();
//   })
// }

// co(read()).then(data => {
//   console.log(data);
// }).catch(err => {
//   console.log(err);
// })

