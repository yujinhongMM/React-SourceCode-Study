// 发布订阅模式 主要分布成两个部分 on emit
// on 就是把一些函数维护到一个数组中
// emit 就是让数组中的方法依次执行
let fs = require('fs');
let person = {};
let event = { // 订阅和发布没有明显的关联
  arr: [],
  on: function(fn) {
    this.arr.push(fn)
  },
  emit: function() {
    this.arr.forEach(item => item())
  }
}

event.on(function() {
  console.log("读取数据中...")
})

event.on(function() {
  if (Object.keys(person).length === 2) {
    console.log(person)
  }
})

fs.readFile('./promise/callback/age.txt', 'utf-8', function (err, data) {
  person.age = data;
  event.emit();
})

fs.readFile('./promise/callback/name.txt', 'utf-8', function (err, data) {
  person.name = data;
  event.emit();
})