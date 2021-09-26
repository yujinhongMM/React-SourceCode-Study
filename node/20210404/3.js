// const EventEmitter = require('events');
const EventEmitter = require('./4.js')
const util = require('util');

function Girl() {

}

util.inherits(Girl, EventEmitter); // 原型继承 需要通过实例来调用继承方法

let girl = new Girl();

const cry = (a) => {
  console.log('吃' + a);
}

girl.on('女生失恋', cry);
girl.on('女生失恋', () => {
  console.log('哭');
})

girl.once('女生失恋', () => {
  console.log('抑郁');
})

setTimeout(() => {
  girl.emit('女生失恋', '馒头');
  girl.off('女生失恋', cry);
  girl.emit('女生失恋', '面包');
})
