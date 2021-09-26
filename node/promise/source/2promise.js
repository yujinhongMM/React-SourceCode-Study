const FULFILLED = 'FULFILLED'; // 成功
const REJECTED = 'REJECTED'; // 失败
const PENDING = 'PENDING'; // 等待
class MyPromise {
  constructor(executor) {
    this.status = PENDING; // promise默认的状态
    this.value - undefined; // 成功的原因
    this.reason = undefined; // 失败的原因
    this.fulfilledCallback = []; // 成功回调
    this.rejectedCallback = []; // 失败回调
    const resolve = (value) => { // 成功resolve函数
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED; // 修改状态
        this.fulfilledCallback.forEach(item => {
          item()
        });
      }
    }
    const reject = (reason) => { // 失败reject函数
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED; // 修改状态
        this.rejectedCallback.forEach(item => {
          item()
        })
      }
    }
    try {
      executor(resolve, reject); // 立即执行
    } catch (e) {
      reject(e)
    }
  }
  // 当用户调用then方法的时候 此时promise可能为等待态，先占存起来，因为后续可能会调用resolve，reject
  then(onFulfilled, onRejected) {
    if (this.status === PENDING) { // 说明then是异步的
      this.fulfilledCallback.push(() => { // AOP
        // todo...
        onFulfilled(this.value);
      })
      this.rejectedCallback.push(() => {
        onRejected(this.reason);
      })
    }
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

module.exports = MyPromise