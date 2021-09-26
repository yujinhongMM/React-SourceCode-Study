
const FULFILLED = 'FULFILLED'; // 成功
const REJECTED = 'REJECTED'; // 失败
const PENDING = 'PENDING'; // 等待
function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('错误'));
  }
  if (typeof x === 'function' || (x !== null && typeof x === 'object')) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, res => {
          resolvePromise(promise, res, resolve, reject);
        }, rej => {
          reject(rej);
        })
      } else {
        resolve(x);
      }
    } catch (err) {
      reject(rej);
    }
  } else {
    resolve(x);
  }
}
class Promise {
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
    let promise = new Promise((resolve, reject) => {
      if (this.status === PENDING) { // 说明then是异步的
        this.fulfilledCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        })
        this.rejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        })
      }
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);

      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
      }
    })
    return promise;
  }
  static all = function (promises) {
    return new Promise((resolve, reject) => {
      let result = [];
      let times = 0;
      const processSuccess = (index, val) => {
        result[index] = val;
        if (++times === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        let p = promises[i];
        if (p && typeof p.then === 'function') {
          p.then((data) => {
            processSuccess(i, data)
          }, reject)
        } else {
          processSuccess(i, p);
        }
      }
    })
  }
  static race = function (promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let p = promises[i];
        if (p && typeof p.then === 'function') {
          p.then(resolve, reject); // 一旦成功就直接 停止
        } else {
          resolve(p);
        }
      }
    })
  }
  static finally = function (cb) {
    return this.then(() => {
      return Promise.resolve(cb()).then(() => data);
    }, () => {
      Promise.resolve(cb());
    })
  }
}

module.exports = Promise