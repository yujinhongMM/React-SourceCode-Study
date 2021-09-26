

// 判断是不是promise，如果是直接调用then
// new Promise((resolve, reject) => {
//   resolve(new Promise((resolve, reject) => {
//     resolve(100)
//   }))
// }).then(data => {
//   console.log(data);
// })


// 一个promise直接resolve一个promise的情况
// static resolve(value) {
//   return new Promise((resolve, reject) => {
//     resolve(value)
//   })
// }
// Promise.reject()同理
// Promise.resolve() 这个方法 创建一个成功的promise
Promise.resolve(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(200)
  }, 3000)
})).then(res => {
  console.log(res)
}, err => {
  console.log(err)
})