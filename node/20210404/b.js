const fs = require('fs');
const path = require('path');
const vm = require('vm');
function Module(id) {
  this.id = id;
  this.exports = {}
}

Module._cache = {}

Module._extensions = {
  '.js'(module) {
    let script = fs.readFileSync(module.id, 'utf-8');
    let templateFn = `(function(exports, module, require, __dirname, __filename){${script}})`;
    let fn = vm.runInThisContext(templateFn);
    let exports = module.exports;
    let filename = module.id;
    let dirname = path.dirname(filename);
    fn.call(exports, exports, module, req, dirname, filename);
  },
  '.json'(module) {
    let script = fs.readFileSync(module.id, 'utf-8');
    module.exports = JSON.parse(script);
  }
}

Module._resolveFilename = function (id) {
  let filePath = path.resolve(__dirname, id);
  let isExists = fs.existsSync(filePath)
  if (isExists) return filePath;
  // 尝试添加策略
  // let keys = Reflect.ownKeys(Module._extensions);
  let keys = Object.keys(Module._extensions); // 以后Object新出的方法都会放到Reflect
  for (let i = 0; i < keys.length; i++) {
    let newPath = filePath + keys[i];
    if (fs.existsSync(newPath)) return newPath;
  }
  throw new Error(`没有找到文件${filePath}`)
}

Module.prototype.load = function () {
  const ext = path.extname(this.id); // 获取文件后缀名
  Module._extensions[ext](this);
}

function req(filename) {
  filename = Module._resolveFilename(filename); // 1、创建一个绝对引用地址，方便后续读取
  let cacheModule = Module._cache[filename];
  if (cacheModule) return cacheModule.exports; // 直接将上次的缓存模块丢出去
  const module = new Module(filename); // 2、根据一个路径创造一个模块
  Module._cache[filename] = module; // 缓存模块，根据的是文件名来缓存
  module.load(); // 3、就是让用户给module.exports赋值
  return module.exports; // 默认是空对象
}

a(1);