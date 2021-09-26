#! /usr/bin/env node
// console.log("ok");

// 这里需要有一个命令行的帮助文档
const program = require('commander');
const options = require('./config');
program.name('fs');
program.usage('[options]');
// program.usage('<option> <Value>');

const examples = new Set();
const defaultMapping = {};
Object.entries(options).forEach(([key, value]) => {
  // console.log(value.option, value.description)
  examples.add(value.usage);
  defaultMapping[key] = value.default;
  program.option(value.option, value.description);
})

program.on('--help', function () {
  console.log('\nExamples:');
  examples.forEach(item => {
    console.log(`${item}`);
  })
})

// 解析当前运行进程传递的参数
program.parse(process.argv);

let userArgs = program.opts();
// 合并最终的参数，需要启动一个服务
console.log(defaultMapping);
let serverOptions = Object.assign(defaultMapping, userArgs);

// console.log(serverOptions);
// console.log(defaultMapping);
// console.log("ok");

// 启动一个服务
const Server = require('../src/server');
let server = new Server(serverOptions);
server.start();