const fs = require('fs');
const path = require('path');
// let ws = fs.createWriteStream(path.resolve(__dirname, 'b.txt'), {
//   flags: 'w',
//   encoding: 'utf8',
//   autoClose: true,
//   start: 0,
//   highWaterMark: 3
// })

// ws.on('open', function (fd) {
//   console.log('open', fd);
// })

// ws.on('close', function () {
//   console.log('close');
// })

// let flag0 = ws.write('1');
// console.log(flag0);
// let flag1 = ws.write('1');
// console.log(flag1);
// let flag2 = ws.write('111111111');
// console.log(flag2);
// let flag3 = ws.write('22');
// console.log(flag3);
// ws.end();


let rs = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
  highWaterMark: 3
});

let ws = fs.createWriteStream(path.resolve(__dirname, 'b.txt'), {
  highWaterMark: 2
});

rs.on('data', function (data) {
  let flag = ws.write(data);
  if (!flag) {
    console.log("吃不下了");
    rs.pause();
  }
})

ws.on('drain', function () {
  console.log('吃完了，再喂我吧');
  rs.resume();
})