// console.log(__dirname); // 当前文件执行的目录
// console.log(__filename); // 文件自己的绝对路径
// console.log(process.cwd()); // 当前工作目录 current working directory
// console.log(process.env); // windows用set mac用export 执行代码时传入的环境
// if (process.env.NODE_ENV === 'development') {
//   console.log('dev');
// } else {
//   console.log('prod');
// }
// [执行node所在的exe文件，当前执行的文件，..其他参数]
// console.log(process.argv); // 执行代码时传入的参数，会根据用户传递的参数来解析，生成对应的功能
// let argv = process.argv.slice(2).reduce((memo, current, index, arr) => {
//   if (current.startsWith('--')) {
//     memo[current.slice(2)] = arr[index + 1]
//   }
//   return memo;
// }, {})
// console.log(argv)

// nextTick node中自己实现的 不属于node中的Eventloop，优先级比promise更高
// console.log("1")
// Promise.resolve().then(() => {
//   console.log('promise');
// })
// console.log("2")
// process.nextTick(() => { //当前执行栈的底部
//   console.log('nextTick');
// })
// console.log("3")

// 都在主模块执行，随机不一定谁在前面，受性能影响
// setTimeout(() => {
//   console.log('setTimeout')
// }, 0);
// setImmediate(() => {
//   console.log("setImmediate")
// })




