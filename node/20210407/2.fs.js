const fs = require('fs');
const path = require('path');
// fs模块中基本上 有两种api（同步、异步）
// 嵌套的写法只适合小的文件
// fs.readFile(path.resolve(__dirname, 'package.json'), function (err, data) {
//   if (err) return
//   fs.writeFile(path.resolve(__dirname, './test.js'), data, function (err, data) {
//     console.log(data);
//   })
// })
let buf = Buffer.alloc(3);
fs.open(path.resolve(__dirname, 'a.txt'), 'r', function (err, fd) {
  // fd file descriptor是一个number类型
  // 读取a.txt将读取到的内容写到bufer的第0个位置写3个，从文件的第6个位置开始写入
  fs.read(fd, buf, 0, 3, 6, function (err, bytesRead) { // bytesRead读取到的真实个数
    fs.open(path.resolve(__dirname, 'b.txt'), 'w', function (err, wfd) {
      fs.write(wfd, buf, 0, 3, 0, function (err, written) {
        console.log(written)
        fs.close(fd, () => { })
      })
    })
    console.log(bytesRead)
    console.log(buf)
  });
})

// 