let promise = new Promise((resolve, reject) => {
  resolve(1);
}).then(res => {
  console.log(res)
}, err => {
  console.log(err)
})