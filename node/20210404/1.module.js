// node中模块 es6Module commonjs规范 两种规范
// 用webpack打包后 es6Module -> commonjs模块
// 【es6Module】es6"静态"（tree-shaking）可以在编译的时候进行分析 
// 【commonjs规范】"动态"模块 在代码执行的时候引入模块（无法做tree-shaking）



// path
// const path = require('path'); // resolve, join
// console.log(path.resolve(__dirname, 'a', 'b', 'c', '/'))


// 字符串如何能变成js来执行？
// eval会执行环境影响
// new Function “模版引擎的实现原理” 可以获取全局变量，还是会有污染的情况
// node中自己实现了一个模块vm（沙箱环境）不受外界影响 
// 如何实现沙箱 1、快照（执行前记录信息，执行后还原信息） 2、


// let a = 1;
// console.log(eval(a));

// let a = 1;
// // new Function('b', 'console.log(a);console.log(b)')(1)
// new Function('b', 'console.log(b)')(1)


// cosnt vm = require('vm');
// let a = 'pppp';
// vm.runInThisContext(`console.log(a)`);

const fs = require("fs"); // require内部就是使用readFileSync
let r = fs.readFileSync('./20200404/1.txt', 'utf-8'); // 同步读取文件
let exists = fs.existsSync('./20200404/1.txt'); // 同步判断文件是否存在，此方法的异步的方法被废弃了
const path = require('path'); // resolve, join
// => 当前文件目录：/Users/yujinhong/Desktop/study/20200404/1.module.js
console.log(path.resolve('a', 'b', 'c')); // 解析绝对路径，解析默认采用process.cwd()
// =>  /Users/yujinhong/Desktop/study/a/b/c
console.log(path.resolve(__dirname, 'a', 'b', 'c'));
// => /Users/yujinhong/Desktop/study/20200404/a/b/c
console.log(path.resolve(__dirname, 'a', 'b', 'c', '/')); // 如果有路径/会回到根路径
// => /
console.log(path.join('a', 'b', 'c', '/')); // 单纯的拼接路径，不回产生绝对路径，遇到/也会拼到一起
// => a/b/c/
console.log(path.join(__dirname, 'a', 'b', 'c', '/'));
// => /Users/yujinhong/Desktop/study/20200404/a/b/c/
console.log(path.extname('a.min.js')); // 获取扩展名
// => .js
console.log(path.basename('a.js', '.js'));
// => a
console.log(path.relative('a/b/c/1.js', 'a')); // 根据路径获取相对路径
// => ../../..
console.log(path.dirname('a/b/c')); // 取当前文件的父路径 __dirname的实现，就是path.dirname
// => a/b


// console.log(new Function('a', 'console.log(a)').toString())
global.a = 100; // 在node中全局变量是多个模块共享的，所以尽量不要通过global定义
const vm = require('vm');
vm.runInThisContext(`console.log(a)`); // => 100 当前上下文
vm.runInContext(`console.log(a)`); // => 报错
vm.runInNewContext(`console.log(a)`); // => 报错 创造一个全新的上下文
