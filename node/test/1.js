function curring(fn) {
  const inner = (args = []) => {
    return args.length === fn.length ? fn(...args) : (...userArgs) => inner([...args, ...userArgs]);
  }
  return inner();
}

function isType(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

let util = {};

['Number', 'toString', 'Undefined', 'Object', 'Boolean', 'Function', 'Null'].forEach(item => util['is' + item] = curring(isType)(item))

console.log(util.isNumber(1))