// fs.readFile(需要将文件读取到磁盘中，占用内存) -》 fs.writeFile
// fs.read() -> fs.write();
const fs = require('fs');
function copy(source, target, cb) {
  const BUFFER_SIZE = 3;
  const BUFFER = Buffer.alloc(BUFFER_SIZE);
  const R_OFFSET = 0;
  const W_OFFSET = 0;
  fs.open(source, 'r', function (err, rfd) {
    fs.open(target, 'w', function (err, wfd) {
      fs.read(rfd, BUFFER, 0, BUFFER_SIZE, R_OFFSET, function (err, bytesRead) {
        if (err) return cb(err);
        if (bytesRead) {
          fs.write(wfd, BUFFER, 0, bytesRead, W_OFFSET, function (err, written) {
            R_OFFSET += bytesRead;
            W_OFFSET += written;
          })
        }
      })
    })
  })
}

copy('./20210409/a.txt', './20210409/b.txt', function (err, write) {
  if (err) return console.log(err);
  console.log('copy success')
});