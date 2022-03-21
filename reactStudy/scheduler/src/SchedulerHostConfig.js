// 将要被调度的回调函数
let scheduledHostCallback = null;
// 创建消息管道
const messageChannel = new MessageChannel();
messageChannel.port1.onmessage = performWorkUntilDeadline;
// 截止时间
let deadline = 0;
// 每一帧我会申请5毫秒
let yieldInterval = 5;
export function getCurrentTime() {
    return performance.now();
}
/**
 * 执行工作直到截止时间
 */
function performWorkUntilDeadline() {
    // 获取当前的时间
    const currentTime = getCurrentTime();
    // 计算截止时间：当前时间➕申请时间 等于截止时间
    deadline = currentTime + yieldInterval;
    // 需要知道这个 被调度的回调函数 有没有执行完；
    const hasMoreWork = scheduledHostCallback(currentTime);
    // 如果hasMoreWork为true，说明工作没干完，就被打断放弃了，后面还得继续干，
    // 它会让浏览器再添加一个宏任务performWorkUntilDeadline，会在下一帧开始的执行
    if (hasMoreWork) {
        messageChannel.port2.postMessage(null);
        // requestAnimationFrame(performWorkUntilDeadline)
    }
}
export function requestHostCallback(callback) {
    scheduledHostCallback = callback;
    // 一旦port2发消息了，会向宏任务队列中添加一个宏任务，执行port1.onmessage方法；
    // 告诉浏览器在下一帧执行preforWorkUntilDeadline
    messageChannel.port2.postMessage(null);
    // requestAnimationFrame(performWorkUntilDeadline);
}

/**
 * 是否应该放弃执行权/中断
 * @returns boolean
 */
export function shouldYieldToHost() {
    // 获取当前的时间
    const currentTime = getCurrentTime();
    // 如果当前时间大于截止时间了，说明到期了，时间片已经用完了，需要返回true，放弃执行任务
    return currentTime >= deadline;
}