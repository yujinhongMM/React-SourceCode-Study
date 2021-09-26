Promise.resolve(1)
  .then(x => x + 1)  // 2
  .then(x => {
    throw new Error('my error')
  })
  .catch(() => 1) // 1
  .then(x => x + 1) // 2
  .then(x => console.log(x)) // 2
  .catch(err => console.log(err))

  // EventLoop 浏览器 事件触发线程
  // js是“主”线程是单线程的
  // 应用 =》进程 =》线程
  // 浏览器是一个多进程模型
  // 浏览器每个页卡都是一个独立的进程
  // 浏览器的渲染进程（浏览器内核）
  // 浏览器的渲染进程 (页面渲染 线程 js执行 线程)
  // js 和 页面渲染是互斥的不能同时进行 (假如是多线程)
  // 主线程是单线程 js代码从上到下 一行行执行
  // ajax 事件 promise （异步方法）要等待
