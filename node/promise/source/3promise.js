// ---------------------------分析-------------------------
// 1、promise的链式调用 当调用then方法后会返回一个新的prosmise
// 情况1:then中方法返回的是一个是一个普通值，不是promise的情况，会作为外层下一次then的成功结果
// 情况2:then中方法会执行出错，会走到外层下一次=then的失败结果
// 情况3:如果then中发那嘎发返回的是一个promise对象，此时会根据promise的结果来处理是走成功还是失败 （传入的是成功或者失败的内容）
// 无论上一次then走是成功还是失败，只要返回的是普通值 都会执行下一次then的成功
// 总结： 如果返回一个普通值 （除了promise） 就会传递给下一个then的成功，如果返回一个失败的promise或者抛出异常，会走下一个then的失败

// 如果then中传入的是个promise，利用x的值来判断是调用promise2的resolve还是reject
function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('错误'))
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') { // 有可能是promise
    let called = false;
    try { // 有可能then方法是通过defineProperty来实现的 取值时可能会发生异常
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, res => {
          resolvePromise(promise, res, resolve, reject)
        }, err => {
          reject(err)
        })
      } else {
        resolve(x);
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x); // 说明返回的是一个普通值 直接将他放到promise2.resolve中
  }
}

// 1、链式调用解决嵌套回调的问题
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
    // then 的透传 .then().then()
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; }
    const myPromise = new MyPromise((resolve, reject) => {
      if (this.status === PENDING) { // 说明then是异步的
        this.fulfilledCallback.push(() => { // AOP
          // todo...
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(myPromise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)

        })
        this.rejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(myPromise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(myPromise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(myPromise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
    })
    return myPromise;
  }
}

module.exports = MyPromise