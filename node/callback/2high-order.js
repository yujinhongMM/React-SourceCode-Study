// 函数柯里化 函数反柯里化

// 判断变量的类型
// 常用的判断类型的方法有4种
// 1、typeof 不能判断对象类型 [] {} null 都是对象
// 2、constructor 可以找到这个变量是谁构造出来的 深拷贝
// 3、instanceof 判断是谁的实例__proto__
// 4、object.prototype.toString.call() 缺陷不能细分谁是谁的实例

// function isType(value, type) {
//   return Object.prototype.toString.call(value) === `[object ${type}]`
// }
// // 能不能将方法细分
// console.log(isType([], 'Array'))

// function isType(type) {
//   return function(value) {
//     return Object.prototype.toString.call(value) === `[object ${type}]`;
//   }
// }

// let isArray = isType('Array');
// console.log(isArray("hello"))
// console.log(isArray([]))


// 预习课上的
// function isType(type, value) {
//   return Object.prototype.toString.call(value) === `[object ${type}]`
// }

// // 通过一个柯里化函数，实现通用的柯里化方法
// const currying = (fn, arr = []) => {
//   let len = fn.length;
//   return function(...args) {
//     arr = [...arr,...args];
//     if (arr.length < len) {
//       return currying(fn, arr); // 递归不停的产生函数
//     } else {
//       return fn(...arr);
//     }
//   }
// }

// let isArray = currying(isType)('Array');
// let isString = currying(isType)('String');
// console.log(isArray([]));
// console.log(isArray('123'));

// 正式课上的
function isType(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`; 
}

// 柯里化需要已知参数个数
function curring(fn) {
  const inner = (arr = []) => {
    return (arr.length >= fn.length ? fn(...arr) : (newArr) => inner([...arr, newArr]));
  }
  return inner();
}

let util = {};
['String', 'Number', 'Boolean', 'Null', 'Undefined'].forEach(type => {
  util['is'+type] = curring(isType)(type)
})

console.log(util)
console.log(util.isString(''));