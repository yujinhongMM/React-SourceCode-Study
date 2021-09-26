function * read() {
  let a = yield 8;
  console.log("a-----", a);
  let b = yield 6;
  console.log(b);
  return 100;
}

let it = read();
let {value, done} = it.next();
console.log("-----next(1)-----", value, done)
let {value:value2, done: done2} = it.next('jinhong');
console.log("-----next(2)-----", value2, done2)
console.log(it.next(value2))