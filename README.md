# 课件地址：
http://www.zhufengpeixun.com/strong/html/106.1.react.html


- 1. 全局安装： npm install create-react-app -g

- 2. babel： babel并没有把JSX编译成虚拟DOM，而是把JSX编译成了React.createElement的方法调用
    https://www.babeljs.cn/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=DwCwjABAxgNghgZwQOTgWwKYF4BEAXASzxgxwgTwE8SsBvW6AexkYCcAuCAclYwBMuEAL5CAfCAwwWwBAAc4AO1EB3NjD7AA9HMWit4UUA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.14.8&externalPlugins=

    

    ![image-20210728144117163](http://pic2.58cdn.com.cn/images/xq_img/n_v240fb7be8b3c0458bbb1e6df398db81f2.png)

    ![image-20210728144433045](http://pic2.58cdn.com.cn/images/xq_img/n_v285a7e7a0600a4d5c8935357b10f09121.png)

+ 3. 实现react的核心

     + 将package.json里的start等改为🈲️用jsx 

       ```javascript
       "scripts": {
           "start": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts start",
           "build": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts build",
           "test": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts test",
           "eject": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts eject"
         },
       ```

       <img src="http://pic2.58cdn.com.cn/images/xq_img/n_v26a67128c3588431280d2d81b467a08a2.png" alt="image-20210728145602442" style="zoom:50%;" />

       cross-env 跨平台 npm install cross-env --save-dev

       <img src="http://pic2.58cdn.com.cn/images/xq_img/n_v2a58f6015ef1c44d6a970fd782e6d5eb2.png" alt="image-20210728145831729" style="zoom: 40%;" />

<img src="http://pic2.58cdn.com.cn/images/xq_img/n_v252c7d4a62a6c4393a37baba315a9fb16.png" alt="image-20210728150036124" style="zoom:40%;" />

+ 将package.json里的start等改为🈲️用jsx 

<img src="http://pic2.58cdn.com.cn/images/xq_img/n_v24fcb5107b5d14e72925ba5aa6ab5d340.png" alt="image-20210728170239429" style="zoom:50%;" />


http://www.zhufengpeixun.com/strong/html/106.1.react.html#t6613.1 cra支持装饰器

新增
jsconfig.json config-overrides.js
```javascript
"scripts": {
    "start": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts start",
    "build": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts build",
    "test": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts test",
    "eject": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts eject"
  },

  替换成

"scripts": {
    "start": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired start",
    "build": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired build",
    "test": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired test",
    "eject": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired eject"
  },
```

