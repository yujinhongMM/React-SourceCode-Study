const fs = require('fs').promises;
const { existsSync } = require('fs');
// function mkdir(pathStr, cb) {
//   let pathList = pathStr.split('/'); // [a,b,c,d]
//   let index = 1;
//   function make() {
//     if (index !== pathList.length + 1) {
//       let currentPath = pathList.slice(0, index++).join('/');
//       fs.stat(currentPath, function (err) {
//         if (err) {
//           fs.mkdir(currentPath, make);
//         } else {
//           make();
//         }
//       })
//     } else {
//       cb();
//     }
//   }
//   make();
// }

// function mkdir(pathStr, cb) {
//   let pathList = pathStr.split('/');
//   let index = 1;
//   function make(err) {
//     let currentPath = pathList.slice(0, index++).join('/');
//     if (index === pathList.length + 1) return cb(err);
//     fs.stat(currentPath, function (err) {
//       if (err) {
//         fs.mkdir(currentPath, make);
//       } else {
//         make()
//       }
//     });
//   }
//   make();
// }

async function mkdir(pathStr) {
  let pathList = pathStr.split('/');
  for (let i = 1; i < pathList.length + 1; i++) {
    let currentPath = pathList.slice(0, i).join('/');
    if (!existsSync(currentPath)) {
      await fs.mkdir(currentPath);
    }
  }
}
mkdir('a/b/c/d').then(() => {
  console.log("创建成功");
}, err => {
  console.log(err);
})