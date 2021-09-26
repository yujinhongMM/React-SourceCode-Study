// 前端是无法直接读取文件 操作文件（node是使用在服务器端的）
// 对文件和前端传递的数据进行处理
// 进制数据 所有内容都是以二进制来进行存储的，数据都是以2进制形式来表现的

// 最终数据都是以2进制来存储的 所以回出现不精准的情况

// 二进制 是进制的区别 10进制中最大的是9 2进制中最大的时候是1
// 我们以字节为单位来存储数据 8为 -》 1个字节   1024个字节 -》 1k   1024k -》1M 
// console.log((0x64).toString())
// console.log((0x64).toString(2))
// console.log((64).toString(2))

// 10进制中的0.5是2进制的多少？

// 进制转化问题；
// console.log(0.1 + 0.2);
// 为什么0.2 + 0.2 就没有这个问题
// 那么如果出现精度问题你要如何解决

// 在服务端，我们需要一个东西来表示内存。单不能是字符串，因为字符串无法表示图片
// node中用Buffer来白噢是内存的数据 它把内容转换成了16进制来显示（16进制比较短）
// 255 -> 1111111 

// 全部统一成utf-8，node不支持gbk 只支持utf8
// BUffer代表的是内存，内存是一段固定的空间，产生的内存是固定大小，不能随意添加
// 扩容的概念，需要动态创建一个新的内容，把内容迁移过去

// npm install @types/node可以支持node提示（仅仅是安装了ts的提示而已，为了方便)；

// const buffer = Buffer.alloc(5);
// console.log(buffer);
// console.log(buffer[0]);
// const buffer2 = Buffer.from([0x25, 0x26, 0x300]); // 超过255会取余
// console.log("buffer2", buffer2);

// let buffer3 = Buffer.from('哈哈');
// console.log("buffer3", buffer3);

// buffer的使用

const r = Buffer.from('人').toString('base64'); // 可以调用toString转化成制定的编码
console.log(r);

// toString('utf8'/'base64);
// alloc from slice copy concat indexOf inBuffer buffer.length
console.log("余金鸿from", Buffer.from("余金鸿"));

// 实现非递归版本的深拷贝

// copy可以将buffer的数据拷贝到另一个buffer上（一般用不到，concat是基于buffer的）
let bf0 = Buffer.from('余');
let bf1 = Buffer.from('金');
let bf2 = Buffer.from('鸿');
let bigBuffer = Buffer.alloc(12);
