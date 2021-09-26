// Promise.resolve() 这个方法  会创造一个成功的promise

let Promise = require('./source/3.promise')
Promise.reject(new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(200);
    }, 1000);
})).then((data) => {
    console.log(data)
}).catch(err=>{ // catch方法就是没有成功的失败
    console.log(err,'err')
});

// Promise.all Promise.finally  休息5分钟