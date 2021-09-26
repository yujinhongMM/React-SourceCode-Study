// let p = new Promise(function (resolve, reject) {
//   reject();
//   resolve();
// })
// p.then(function () {
//   console.log('成功')
// }, function () {
//   console.log('失败')
// })
// => 失败

// const promise = new Promise((resolve, reject) => {
//   console.log(1)
//   resolve()
//   console.log(2)
// })
// promise.then(() => {
//   console.log(3)
// });
// => 1 2 3

// Promise.resolve(1)
//   .then(res => 2)
//   .catch(err => 3)
//   .then(res => console.log(res));
// => 2

Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { throw new Error('My Error') })
  .catch(() => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch(console.error)