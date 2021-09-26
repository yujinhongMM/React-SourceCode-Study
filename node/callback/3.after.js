// 多个异步请求如何同时获取最终结果

let fs = require('fs');
let person = {};

function after(time, callback) {
  return function() {
    if (--time == 0) {
      callback();
    }
  }
}

let cb = after(2, function() {
  console.log(person)
})

fs.readFile('./promise/callback/age.txt', 'utf-8', function (err, data) {
  person.age = data;
  cb()
})

fs.readFile('./promise/callback/name.txt', 'utf-8', function (err, data) {
  person.name = data;
  cb()
})