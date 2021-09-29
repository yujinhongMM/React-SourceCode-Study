// 1)我们要监控页面的性能 - 算时间差 Performance Api
// import perf from './performance.js';
// let formatObj = (data) => {
//     let arr = [];
//     for (let key in data) {
//         arr.push(`${key}=${data[key]}`);
//     }
//     return arr.join('&');
// }
// perf.init((data) => { // 获取到页面性能相关的数据
//     // 图片可能没有大小 空的图片
//     new Image().src = "/p.gif?" + formatObj(data);
//     console.log("获取到页面性能相关的数据", data);
// });

// 2)我们要监控页面静态资源的加载情况
// import resource from './resource.js';
// resource.init((data) => {
//     console.log("监控页面静态资源的加载情况", data);
// })

// ajax监控ajax发送情况
// import xhr from './xhr';
// xhr.init((data) => {
//     console.log("ajax监控ajax发送情况:", data);
// })
// 页面的错误捕捉
// try/catch 代码出错了
import errCatch from './errCatch'
errCatch.init((data) => {
    console.log('页面的错误捕捉', data)
})
// 监控用户的行为
// 点击的时候利用图片的那种方式上报上去
// 或者