const fs = require('fs');
const path = require('path');
// const rs = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
//   highWaterMark: 3
// })
const ws = fs.createWriteStream(path.resolve(__dirname, 'b.txt'), {
  highWaterMark: 3
})
let i = 0;
function write() {
  let flag = true;
  while (i < 10 && flag) {
    flag = ws.write(i++ + '');
  }
}
ws.on('drain', function () {
  console.log("写完了");
  write();
})
write()