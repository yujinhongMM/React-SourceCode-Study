import { 
    requestHostCallback,
    shouldYieldToHost as shouldYield,
    getCurrentTime,
    requestHostTimeout
} from './SchedulerHostConfig';
import { push, pop, peek } from './SchedulerMinHeap';
import { ImmediatePriority, UserBlockingPriority, NormalPriority, LowPriority, IdlePriority } from './SchedulerPriorities';

// 每个优先级对应的任务对应一个过期时间
var maxSigned31BitInt = 1073741823;
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
var USER_BLOCKING_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
// 用于任务自增的id
let taskIdCounter = 0;

// 为了同时调度多个任务，而不会互相覆盖，需要搞一个任务队列(已经开始的队列)
let taskQueue = [];
// 尚未开始的任务队列
let timerQueue = [];
// 当前的任务
let currentTask;
/**
 * 调度一个回调任务
 * @param {*} priorityLevel 优先级
 * @param {*} callback 
 */
function scheduleCallback (priorityLevel, callback, options) {
    // 获取当前时间
    let currentTime = getCurrentTime();
    // 此任务的开始时间
    let startTime;
    if (typeof options === 'object' && options !== null) {
        let delay = options.delay;
        // 如果delay是一个数字，那么开始时间等于当前时间+延迟时间
        if (typeof delay === 'number' && delay > 0) {
            startTime = currentTime + delay;
        } else {
            // 否者就是开始时间等于当前时间，也就是立刻开始
            startTime = currentTime;
        }
    } else {
        startTime = currentTime;
    }
    // 计算超时时间
    let timeout;
    switch (priorityLevel) {
        case ImmediatePriority: 
            timeout = IMMEDIATE_PRIORITY_TIMEOUT; 
            break;
        case UserBlockingPriority: 
            timeout = USER_BLOCKING_TIMEOUT; 
            break;
        case NormalPriority: 
            timeout = NORMAL_PRIORITY_TIMEOUT; 
            break;
        case LowPriority: 
            timeout = LOW_PRIORITY_TIMEOUT; 
            break;
        case IdlePriority: 
            timeout = IDLE_PRIORITY_TIMEOUT; 
            break;
    }
    // 计算一个过期时间 = 当前时间 + 超时时间
    let expirationTime = startTime + timeout;
    let newTask = {
        id: taskIdCounter++, // 每一个任务都有一个自增的id
        callback, // 真正要执行的函数
        priorityLevel, // 优先级保存下来
        expirationTime, // 过期时间
        startTime, // 任务开始的时间
        sortIndex: -1 // 排序值
    }
    // 如果说任务开始时间大于当前时间，说明此任务不需要立刻开始，需要等待一段时间后才开始
    if (startTime > currentTime) {
        // 如果是延迟任务，那么在timerQueue中的排序依赖就是开始时间了
        newTask.sortIndex = startTime;
        // 添加到延迟任务最小堆里，优先队列里
        push(timerQueue, newTask);
        // 如果现在开始队列里已经为空了，并且新添加的这个延迟任务是延迟任务队列优先级最高的那个任务
        if(peek(taskQueue) === null && newTask === peek(timerQueue)) {
            // 开启一个定时器，等到此任务的开始时间到达的时候检查延迟任务并添加到taskQueue中
            requestHostTimeout(handleTimeout, startTime - currentTime);
        }
    } else {
        // 任务在最小堆里的排序依赖就是过期时间
        newTask.sortIndex = expirationTime;
        // 向最小堆里添加一个新的任务，先比较优先级（索引）再比id
        push(taskQueue, newTask);
        // taskQueue.push(callback);
        requestHostCallback(flushWork);
    }
    return newTask;
}

/**
 * 处理延迟任务
 * 负责把延迟队列中那些已经到达开始时间的任务从延迟队列中取出来，添加到taskQueue中执行
 */
function handleTimeout(currentTime) {
    advanceTimes(currentTime);
    if (peek(taskQueue) !== null) {
        // 如果任务队列里有任务，就再次调度一个flushWork，它会调用workLoop开始循环去清空任务队列
        requestHostCallback(flushWork);
    } else {
        // 从延迟队列中去第一个任务，也就是最早开始的那个任务
        const firstTimer = peek(timerQueue);
        if (firstTimer) {
            requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
}

function advanceTimes(currentTime) {
    // 取出延迟队列顶部的任务，也就是最早开始的那个任务
    let timer = peek(timerQueue);
    while (timer) {
        if (timer.callback === null) {
            pop(timerQueue);
            // 如果此延迟任务的开始时间小于等于当前时间，说明这个任务应该开始了
        } else if (timer.startTime <= currentTime) {
            pop(timerQueue);
            // 在任务队列中排序的依据是过期时间
            timer.sortIndex = timer.expirationTime;
            push(taskQueue, timer);
        } else {
            // 如果说没有到此任务的开始时间可以直接返回了
            return;
        }
        timer = peek(timerQueue);
    }
}


/**
 * 依次执行任务队列中的任务
 */
function flushWork(currentTime) {
    return workLoop(currentTime);
}
/**
 * 在这里有两个打断或者停止执行
 * 在执行每一个任务的时候，如果时间片到期了会退出workLoop
 * 另一个是在执行currentTask的时候，如果时间片到期了，也会退出执行
 * @returns 
 */
function workLoop(currentTime) {
    // 取出优先队列中的优先级最高的堆顶元素，也就是过期时间最早的元素
    currentTask = peek(taskQueue); // 等同于currentTask = taskQueue[0];
    while(currentTask) {
        // 如果说时间片到期了，就退出循环
        // 如果说过期时间大于当前时间，并且时间片到期就推出执行 => 如果说已经过期了，及时时间片到期了，也需要继续执行 => 如果一个任务过期了，则不再考虑所谓时间配额问题了，立刻马上权利执行结束
        if (currentTask.expirationTime > currentTime && shouldYield()) {
            break;
        }
        // 取出当前任务的回调函数calculate
        const callback = currentTask.callback;
        // 如果它是一个函数的话
        if (typeof callback === 'function') {
            // 先清空
            currentTask.callback = null;
            // 判断此任务是否过期
            const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
            const continuationCallback = callback(didUserCallbackTimeout);
            if (typeof continuationCallback === 'function') {
                currentTask.callback = continuationCallback;
            } else {
                pop(taskQueue);
            }
        } else {
            // 如果任务的callback属性不是函数，则将此任务出队，这个在后面的取消任务的会用到
            pop(taskQueue);
        }
        // 继续取出最小堆堆顶的任务
        currentTask = peek(taskQueue);
    }
    if (currentTask) {
        return true;
    } else {
        // 说明taskQueue已经空了
        const firstTimer = peek(timerQueue);
        if (firstTimer) {
            requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
        return false;
    }
}

function cancelCallback(task) {
    task.callback = null;
}

export {
    scheduleCallback,
    shouldYield,
    ImmediatePriority, 
    UserBlockingPriority, 
    NormalPriority, 
    LowPriority, 
    IdlePriority,
    cancelCallback
}