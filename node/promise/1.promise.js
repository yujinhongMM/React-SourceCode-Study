// promsie 的特点以及概念
// promise+规范 都通过这个规范来实现
// promise es6 内部已经实现，ie都不支持，需要polyfill es6-promise
// promise 为什么会产生 
// 1、解决异步问题：多个异步请求并发（希望同步最终结果）Promise.all
// 2、链式异步请求的问题 上一个人的输出是下一个人的输入 Promise的链式调用可以解决这个问题
// 3、缺陷：还是基于回调

// 1、promise有三个状态：成功态(resolve) 失败态(reject) 等待态(pending)【又不成功又不失败】
// 2、promise就是一个类
// 3、promise默认执行器时立即执行
// 4、promise的实例都拥有一个then方法，一个参数是成功的回调，另一个失败的回调
// 5、如何执行函数的时候发生了异常，也会执行失败的逻辑
// 6、promise一旦成功就不能失败，反过来也一样
//// promise的特点 解决了什么问题 1.链式调用解决嵌套回调的问题 和 2.同步并发问题 3. 多个异步处理错误问题
// 用户自己决定失败的原因和成功的原因 成功和失败也是用户定义的
let MyPromise = require('./source/3promise')
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 3000)
  console.log(1)
})

promise.then((res) => {
  console.log(res)
  return new MyPromise((resolve, reject) => {
    reject('失败88888')
  })
}, err => {
  console.log(err)
}).then((res) => {
  console.log("---2res", res)
}, err => {
  console.log("---2err", err)
}).then(res => {
  console.log("-------3res", res)
}, err => {
  console.log("-------res", err)
})

console.log(2)

