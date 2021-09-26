const FULFILLED = 'FULFILLED'; // 成功
const REJECTED = 'REJECTED'; // 失败
const PENDING = 'PENDING'; // 等待
class MyPromise {
  constructor(executor) {
    this.status = PENDING; // promise默认的状态
    this.value - undefined; // 成功的原因
    this.reason = undefined; // 失败的原因
    const resolve = (value) => { // 成功resolve函数
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED; // 修改状态
      }
    }
    const reject = (reason) => { // 失败reject函数
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED; // 修改状态
      }
    }
    try {
      executor(resolve, reject); // 立即执行
    } catch(e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

module.exports = MyPromise