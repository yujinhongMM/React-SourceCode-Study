// http是node内置模块，可以直接来使用
const http = require('http');
// request(获取请求的信息) -> response(给浏览器写数据使用response)
// 流：htpp内部是基于tcp的（net模块， socket双向通信）http1.1他是一个半双工的
// 内部基于socket将其分割出来request， response底层实现还是要基于socket
const url = require('url');
const server = http.createServer((req, res) => {
  console.log('请求行-----------start-----------');
  console.log("请求方法：", req.method); // 请求发那嘎发是大写的
  console.log("请求路径：", req.url); // 请求路径是从路径开始到hash的前面，默认没写路径就是/  /代表的是服务器根路径
  console.log(url.parse(req.url));
  const { pathname, query } = url.parse(req.url, true);
  console.log(pathname, query);
  console.log('请求行-----------end------------');

  console.log('请求头-----------start-----------');
  console.log(req.headers);
  console.log('请求头-----------end------------');


  console.log('读取请求体-----------start------------');
  let chunk = [];
  req.on("data", function (data) {
    chunk.push(data);
    console.log("data:", data);
  })

  req.on('end', function () {
    console.log(Buffer.concat(chunk).toString())
  })
  console.log('读取请求体-----------end------------');

  // 响应状态吗，可以字节设定一般情况不设定
  res.statusCode = 500;

  res.setHeader('MyHeader', 1);
  res.write('hello');
  res.end('ok');


  // post请求和put请求有请求体 req是
})

server.on('request', function (req, res) {
  console.log('request')
})

server.listen(4000, function () { // 监听成功后的回调
  console.log("server start 4000")
})
// 每次更新代码需要重新启动服务，才能运行最新代码
// nodemon 开发时可以使用nodemon监控文件变化 重新启动
// npm install nodemon -g