function a(a,b) {
  console.log('a')
  return a + b;
}
a.prototype.www = 'wwwww';
function b(a,b) {
  console.log('b')
  console.log(this)
  return a - b;
}
console.log(b.call(a,2,1));
console.log(b);