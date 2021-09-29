// 专门用来写页面性能监控的逻辑
let processData = (p) => {
    let data = {
        prevPage: p.fetchStart - p.navigationStart, // 上一个页面到这个页面的时长
        redirect: p.redirectEnd - p.redirectStart, // 重定向的时长
        dns: p.domainLookupEnd - p.domainLookupStart, // dns解析的时长
        connect: p.connectEnd - p.connectStart, // tcp连接的时长
        // 从请求到响应的时长
        send: p.responseEnd - p.requestStart, // 响应结束到请求结束
        ttfb: p.responseStart - p.navigationStart, // 首字节接收到的时长
        domready: p.domInteractive - p.domLoading, // dom准备的时长
        // 白屏
        whiteScreen: p.domLoading - p.navigationStart,
        // dom解析时间
        dom: p.domComplete - p.domLoading,
        // onload的执行时间
        load: p.loadEventEnd - p.loadEventStart,
        tatal: p.loadEventEnd - p.navigationStart
    }
    return data;
}

let load = (cb) => {
    let timer;
    let check = () => {
        if (performance.timing.loadEventEnd) {
            clearInterval(timer);
            cb();
        } else {
            timer = setTimeout(check, 100)
        }
    }
    window.addEventListener('load', check, false);
}

let domread = (cb) => {
    let timer;
    let check = () => {
        if (performance.timing.domInteractive) {
            clearInterval(timer);
            cb();
        } else {
            timer = setTimeout(check, 100)
        }
    }
    window.addEventListener('DOMContentLoaded', check, false);
}


export default {
    init(cb) {
        domread(() => { // 有可能没有触发onload dom解析完成以后先统计一下，可能用户没加载完就关闭页面了
            const perfData = window.performance.timing || window.performance.getEntriesByType("navigation")[0]
            const data = processData(perfData);
            data.type = 'domready'; // 页面数据加载完了
            cb(data);
        })
        load(() => {
            const perfData = window.performance.timing || window.performance.getEntriesByType("navigation")[0]
            const data = processData(perfData);
            data.type = 'loader'; // 页面数据加载完了
            cb(data);
        })
    }
}