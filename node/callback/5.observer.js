// 观察者模式 有观察者 肯定有被观察者
// 观察者需要放到被观察者中，被观察者的状态发生变化需要通知观察者，我变化了
// 内部也是基于发布订阅者模式 收集观察者 状态变化后要要通知观察者
class Subject { // 被观察者
  constructor(name) {
    this.name = name;
    this.state = '开心';
    this.observer = []; //  用于存储观察者
  }
  attach(o) { // Subject.prototype.attach
    this.observer.push(o)
  }
  setState(newState) {
    this.state = newState;
    this.observer.forEach(item => item.update(this));
  }
}

class Observer { // 观察者
  constructor(name) {
    this.name = name;
  }
  update(value) {
    console.log(`${this.name}，${value.name}现在的状态是${value.state}的。`)
  }
}

let baby = new Subject('娃');
let mather = new Observer('娘');
let father = new Observer('爹');
baby.attach(mather);
baby.attach(father);
baby.setState('难过');


