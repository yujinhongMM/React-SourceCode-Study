// 可读流，不是一下把文件都读取完毕，而是可以控制读取的个数和读取的速率
const fs = require('fs');
const path = require('path');
let rs = fs.createReadStream(path.resolve(__dirname, 'a.txt'), { // 创建可读流一般情况下不用自己传参数
  flags: 'r',
  encoding: null, // 编码就是buffer
  autoClose: true,
  emitClose: true,
  start: 0,
  highWaterMark: 3 // 每次读取的数据个数 默认是64 * 1024字节 64k
})
// 它会监听data事件，就会触发对应的回调，不停的触发
// 非流动模式 -> 流动模式
rs.on('open', function () {
  console.log("文件打开！");
})

rs.on('data', function (chunk) {
  console.log(chunk);
  rs.pause();
})

rs.on('end', function () {
  console.log("文件读取完毕！");
})

rs.on('close', function () {
  console.log("文件关闭！");
})

rs.on('error', function (err) {
  console.log(err);
})
setInterval(() => {
  rs.resume();
}, 1000);