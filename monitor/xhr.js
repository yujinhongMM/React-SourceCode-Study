
export default {
    init(cb) {
        console.log('监控ajax发送情况');
        let xhr = window.XMLHttpRequest; // 发送请求一般有两种fetch和xhr，这里只讲xhr
        let oldOpen = xhr.prototype.open;
        xhr.prototype.open = function (method, url, async, usename, password) {
            this.info = {
                method, url, async, usename, password
            }
            return oldOpen.apply(this, arguments);
        }
        let oldSend = xhr.prototype.send;
        xhr.prototype.send = function (value) {
            let start = Date.now();
            let fn = (type) => () => {
                this.info.time = Date.now() - start;
                this.info.requestSize = value ? value.length : 0;
                this.info.responseSize = this.responseText.length;
                this.info.type = type;
                cb(this.info); // 把收集的Ajax数据传递出去
            }
            this.addEventListener('load', fn('load'), false);
            this.addEventListener('error', fn('error'), false);
            this.addEventListener('abort', fn('abort'), false);
            return oldSend.apply(this, arguments);
        }
    }
}