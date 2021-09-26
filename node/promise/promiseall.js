// 多个promise全部完成后获取结果，但是其中的某个如果失败了，那么这个promise就失败了
// 同步（同一时刻拿到）多个异步请求的结果
Promise.all([1, 2, 3, new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功")
  }, 1000)
})]).then(data => console.log(data)).catch(err => {
  console.log(err)
})


Promise.all = function (promise) {

}