const fs = require('fs');
const path = require('path');

const rs = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
  highWaterMark: 4
});
const ws = fs.createWriteStream(path.resolve(__dirname, 'b.txt'), {
  highWaterMark: 1
});

rs.pipe(ws); // 这个方法是同步还是异步？异步，缺陷无法看到具体过程
// rs.on('data', function (data) {
//   let flag = ws.write(data);
//   if (!flag) {
//     rs.pause();
//   }
// })

// ws.on('drain', function () {
//   console.log('xxx');
//   rs.resume();
// })