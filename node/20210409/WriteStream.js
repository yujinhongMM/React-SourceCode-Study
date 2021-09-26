const EventEmitter = require('events');
class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.encoding = options.encoding || 'utf-8';
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.mode = options.mode || 0o666;
    this.end = options.end;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.len = 0;
    this.needDarin = false;
    this.write = false;
    this.offset = 0;
    this.cache = [];
    this.open();
  }

  open() {
    fstat.open(this.path, this.flags, this.mode, (err, fd) => {
      this.fd = fd;
      this.emit('open', fd);
    })
  }


  write(chunk, encoding = this.encoding, cb = () => { }) {
    console.log(this.fd);
    // 1、将数据全部转化成buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let returnValue = this.len < this.highWaterMark;
    this.needDarin = !returnValue;
    if (!this.writing) {
      this.writing = true;
      console.log('真正的写入');
    } else {
      console.log('保存到缓存区');
      this.cache.push({
        chunk,
        encoding,
        cb
      })
    }
    return returnValue;
  }

  _write(chunk, encoding, cb) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, cb));
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      this.offset
    })
  }

