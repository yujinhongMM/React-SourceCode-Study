// 消息管道
let messageChannel = new MessageChannel();
let port1 = messageChannel.port1;
let port2 = messageChannel.port2;

port1.onmessage = (event) => {
    console.log('port1.onmessage', event.data);
}

port2.onmessage = (event) => {
    console.log('port2.onmessage', event.data);
}

port1.postMessage('port1发的消息');
port2.postMessage('port2发的消息');