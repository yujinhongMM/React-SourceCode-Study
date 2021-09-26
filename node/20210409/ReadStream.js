const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    // 放在实例上
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.end = options.end;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.flowing = false;
    this.open(); // 文件打开，注意这个方法是异步的
    // 用户监听了data事件才需要读取
    this.on('newListener', function (type) {
      // console.log(type);
      if (type === 'data') {
        this.flowing = true;
        this.read();
      }
    })
    this.offset = this.start;

  }
  pause() {
    this.flowing = false;
  }
  resume() {
    this.flowing = true;
    this.read();
  }
  read() {
    // 希望在open之后猜打开
    if (typeof this.fd !== 'number') {
      // console.log("88888888")
      return this.once('open', () => this.read())
    }

    // console.log("this.fd", this.fd)
    const buffer = Buffer.alloc(this.highWaterMark);
    let howMutchToRead = this.end ? Math.min(this.end - this.offset + 1, this.highWaterMark) : this.highWaterMark;
    fs.read(this.fd, buffer, 0, howMutchToRead, this.offset, (err, bytesRead) => {
      if (bytesRead) {
        this.offset += bytesRead;
        this.emit('data', buffer.slice(0, bytesRead));
        if (this.flowing) {
          this.read();
        }
      } else {
        this.emit('end');
        this.destroy();
      }
    });
  }
  destroy(err) {
    if (err) {
      this.emit('error', err);
    }
    if (this.autoClose) {
      fs.close(this.fd, () => this.emit('close'));
    }
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.destroy(err);
      }
      this.fd = fd;
      this.emit('open', fd);
    })
  }
}

let rs = new ReadStream(path.resolve(__dirname, 'a.txt'), { // 创建可读流一般情况下不用自己传参数
  flags: 'r',
  encoding: null, // 编码就是buffer
  autoClose: true,
  emitClose: true,
  start: 0,
  highWaterMark: 3 // 每次读取的数据个数 默认是64 * 1024字节 64k
})

let timer = setInterval(() => {
  rs.resume();
}, 1000);

rs.on('open', function (fd) {
  console.log("文件打开！", fd);
})

rs.on('data', function (chunk) {
  console.log(chunk.toString());
  rs.pause();
})

rs.on('end', function () {
  console.log("文件读取完毕！");
})

rs.on('close', function () {
  console.log("文件关闭！");
  clearInterval(timer);
})

rs.on('error', function (err) {
  console.log(err);
})




module.exports = ReadStream