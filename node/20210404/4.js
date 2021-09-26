function EventEmitter() {
  this._events = {}
}

EventEmitter.prototype.on = function (eventName, callback) {
  if (!this._events) {
    this._events = {}
  }
  if (this._events[eventName]) {
    this._events[eventName].push(callback);
  } else {
    this._events[eventName] = [callback];
  }
}

EventEmitter.prototype.emit = function (eventName, ...args) {
  this._events[eventName].forEach(fn => {
    fn(...args);
  });
}

EventEmitter.prototype.off = function (eventName, callback) {
  if (this._events && this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(fn => fn !== callback && fn.l !== callback)
  }
}

EventEmitter.prototype.once = function (eventName, callback) {
  const one = () => {
    callback();
    this.off(eventName, one);
  }
  one.l = callback; // 自定义属性
  this.on(eventName, one);
}

module.exports = EventEmitter;