const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mime = require('mime');
const crpto = require('crypto');

const server = http.createServer((req, res) => {
  // console.log('%c [ req ]', 'font-size:13px; background:pink; color:#bf2c9f;', req)
  let { pathname, query } = url.parse(req.url, true);
  // console.log("wwwww", pathname);
  // console.log("---", query);
  let filePath = path.join(__dirname, 'public', pathname);

  fs.stat(filePath, function (err, statObj) {
    if (err) {
      res.statusCode = 404;
      res.end('NOT FOUND');
    } else {
      if (statObj.isFile()) {
        const ctime = statObj.ctime.toGMTString();
        if (req.headers['if-modified-since'] === ctime) {
          res.statusCode = 304;
          res.end();
        } else {
          fs.createReadStream(filePath).pipe(res);
        }

      } else {
        let htmlPath = path.join(filePath, 'index.html');
        fs.access(htmlPath, function (err) {
          if (err) {
            res.statusCode = 404;
            res.end('NOT FOUND')
          } else {
            fs.createReadStream(htmlPath).pipe(res);
          }
        })
      }
    }
  })
})

server.listen(3000, () => {

})