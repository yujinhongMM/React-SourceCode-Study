const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');
// 并发
async function rmdir(dir) {
  let statObj = await fs.stat(dir);
  if (statObj.isDirectory()) { // 是否是目录
    let dirs = await fs.readdir(dir);
    await Promise.all(dirs.map(item => rmdir(path.join(dir, item))))
    await fs.rmdir(dir);
  } else {
    await fs.unlink(dir);
  }
}

rmdir('a').then(() => {
  console.log('删除成功');
})


// const fs = require('fs').promises;
// const path = require('path');
// async function rmdir(dir) { // 如果用了async await 你就按照同步的逻辑来写就可以了
//   let statObj = await fs.stat(dir);
//   if (statObj.isDirectory()) {
//     let dirs = await fs.readdir(dir);
//     await Promise.all(dirs.map(item => rmdir(path.join(dir, item))))
//     await fs.rmdir(dir);
//   } else {
//     return fs.unlink(dir)
//   }
// }
// rmdir('a').then(() => {
//   console.log(data)
//   console.log('删除成功')
// });
