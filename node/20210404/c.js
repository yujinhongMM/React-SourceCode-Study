const fs = require('fs');
const path = require('path');
const vm = require('vm');
function Module(id) {
  this.id = id;
  this.exports = {}
}
Module._cache = {}
Module._extensions = {
  '.json'(module) {
    let json = fs.readFileSync(module.id, 'utf-8');
    module.exports = JSON.parse(json);
  },
  '.js'(module) {
    let script = fs.readFileSync(module.id);
    let fn = vm.runInThisContext(`(function(module,exports,require,filename,dirname){${script}})`);
    let dirname = path.dirname(module.id);
    fn.call(module, module, module.exports, req, module.id, dirname);
  }
}

Module._resolveFilename = function (filename) {
  let filePath = path.resolve(__dirname, filename);
  if (fs.existsSync(filePath)) return filePath;
  let keys = Reflect.ownKeys(Module._extensions);
  for (let i = 0; i < keys.length; i++) {
    let fileNewPath = filePath + keys[i];
    if (fs.existsSync(fileNewPath)) return fileNewPath;
  }
  throw new Error('没有找到文件');
}

Module.prototype._load = function () {
  const extname = path.extname(this.id);
  Module._extensions[extname](this);
}


function req(filename) {
  filename = Module._resolveFilename(filename);
  if (Module._cache[filename]) {
    return Module._cache[filename].exports;
  }
  let module = new Module(filename);
  module._load();
  Module._cache[filename] = module;
  return module.exports;
}

let a = req('./a.js');
let b = req('./a.js');
let c = req('./a.js');
console.log(a);
a(1)