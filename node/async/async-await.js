let fs = require('fs').promises;

// async 函数执行完毕后返回的就是一个promise
// async + await => generator + co
async function readAge(filePath) {
  let name = await fs.readFile(filePath, "utf-8");
  let age = await fs.readFile(name, 'utf-8');
  return age;
}


readAge('./test/name.txt').then(data => {
  console.log(data)
})

