console.log(module.exports === exports, this === module.exports); // this指代的是当前模块的导出对象
module.exports = 'hello';
// exports = 'hello'; // 不能这样写
/**
 * function() {
 *  let exports = module.exports = {}; // 指向同一个引用地址
 *  exports = 'hello'; // export的引用地址被改变
 *  return module.exports; // 返回的是{}
 *  // 所以不能用exports直接来导出
 * }
 */
// 没有改变引用地址，可以这样写
exports.a = 'hello';
exports.b = 'world';
// 也可以用this
this.c = '!';
// 如果module.exports，exports，this同时存在，那么module.exports优先级是最高的，因为最终会将module.exports直接导出
// exports就是module.exports的一个别名起到了简化的作用

