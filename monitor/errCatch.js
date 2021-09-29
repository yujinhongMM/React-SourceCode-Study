export default {
    init(cb) {
        // 这个不能检测到图片404，需要通过window.addEventListener('error', fn, true);
        // promise失败了不能通过onerror .... 捕获promise错误
        window.onerror = function (message, source, lineno, colno, error) {
            var info = {
                message: error.message,
                name: error.name
            };
            var stack = error.stack;
            let matchUrl = stack.match(/http:\/\/[^\n]*/)[0];
            info.filename = matchUrl.match(/http:\/\/(?:\S*)\.js/)[0];
            let [, row, col] = matchUrl.match(/:(\d+):(\d+)/);
            info.row = row; // 上线的时候代码会压缩 source-map 源码映射找到对应的真实报错
            info.col = col;
            cb(info);
        };
    }
}