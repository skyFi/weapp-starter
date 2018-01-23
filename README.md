# weapp-starter

微信小程序开发最佳实践

## 为什么会有这个 repo 

在小程序之初便开发应用了，现在小程序的开发也越来越成熟了，完善了很多的API、组件、架构等，社区也由原来的零星点点到现在的不大不小，但也算是有了，期间也诞生了很多的开发框架，越来越多的三方辅助库，我也捣鼓出很多。比较有名的算是 `wepy` 和 `labrador`，`wepy` 是 `vue` 风格的小程序开发框架，`labrador` 则比较亲和 `React`，各有千秋，也各有深坑，而 `labrador` 作者目前已经停止更新了 TnT，作为React深度使用者的我来说是忧伤的，于是我捣鼓出 [`wn-cli`](https://github.com/skyFi/weapp-native) 来用类 `React` 快速开发微信小程序，然而在这个过程中，想了很多，为什么需要开发框架呢？小程序本身在一开始就强调框架，且现在做的也不差，后来总结了下，无非是不熟悉小程序这套框架，但学习新的中间框架去开发小程序，这不是更加加大了熟悉成本吗？且出了问题增加了处理的代价。

于是，我重新思考了下，最佳的微信小程序开发实践应该是无痛的，且舒服的，无痛的是指在小程序的飞速发展变更中，我们不用重复的浪费学习第三方框架和原生框架。舒服的是指，我们能用上我们熟悉的流行工程流，如：less 预编译、async/await 异步请求，redux数据管理等。

以上，便是这个 repo 的意义与原因。

## 设计概要

- [x] 优化小程序 `API`
  1. `Promise` 化异步接口
  2. 突破请求数量限制（队列）
- [x] 使用 async/await
- [x] 接入 `Redux` 管理页面数据流
  1. 直接接入，添加可配置项
  2. 添加 `saga` 管理操作
- [x] 样式书写采用 `less` 预编译
  1. 使用 `Gulp` 管理自动编译，持续集成
- [x] `wxs` 管理工具库
  1. 数据的格式化操作，如时间格式化、金币格式化等
- [x] 按需加载，子页面分包（除却 `tab` 页面的其他页面）
  1. 按功能模块分包加载（推荐）
  2. 按 `tab` 分包
  * ps: 小程序[原生分包](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/subpackages.html)
- [x] 资源自动化管理
  1. 上传 CDN

## `Promise` 化异步接口

由于微信的API中异步接口都是有三个回调函数的，分别是`success`，`fail`，`complete`，执行时机同字面上意思（`complete`一定会在接口的最后执行）。于是 结合`Promise`，简单的描述如下：（以下为简版，具体的可以看源码）

原生微信小程序API：
```JavaScript
wx.request({
  // ... 其他一些配置项
  success: () => {},
  fail: () => {},
  complete: () => {}
});
```

添加`Promise`后：
```JavaScript
new Promise((resolve, reject) => {
  wx.request({
    // ... 其他一些配置项
    success: resolve,
    fail: reject,
    complete: resolve, // 这里暂取 resolve 来解决
  });
});
```
`Promise` 化后，使用起来就简单了：
```JavaScript
wx.request({ /* ...一些配置项 */}).then(res => {
  console.log(res)
}, err => {
  console.error(err)
})
```
结合下面的 async/await 就可以更加方便的书写同步代码

## 使用 async/await

1. 添加 `babel`:
```shell
yarn add babel-core
```

2. 安装 `env` presets
```shell
yarn add babel-preset-env
```

3. 使用 `.babelrc`
```json
{
  "presets": [
    "env"
  ]
}
```

4. 在 `Gulp` 中使用 `babel`

```javascript
// install
yarn add gulp-babel

const babel = require('gulp-babel');
// ...
.pipe(babel())
// ...
```

5. 添加 `runtime`，在使用`async/await`的地方引入 `./src/utils/lib/runtime.js` 文件，幸运的是这件事情在这个repo中的`Gulp`任务中自动处理了。

以上，便可以在微信小程序中使用 `async/await`了。

## 样式书写采用 `less` 预编译

为什么选择 `less`，因为简单方便，前端编译，轻量级。

注意：由于小程序本身的限制，在书写样式的时候，不要使用 `less` 的嵌套功能！

1. 添加less 变量库等
```javascript
// ...
.pipe(addLessImport({
      themePath: path.join(__dirname, './src/theme/index.less'),
      commomPath: path.join(__dirname, './src/app.less'),
    }))
// ...
```

2. 编译
```javascript
// ...
.pipe(less({
      paths: [path.join(__dirname, './src/theme')]
    }))
// ...
```

3. 重命名样式文件，以便小程序识别
```javascript
// ...
  .pipe(rename((path) => {
    path.extname = '.wxss';
  }))
// ...
```

## 资源自动化管理 

1. 目前接入阿里云，监测 `assert` 文件夹，自动上传图片资源
2. 根据配置自动生成 less 配置 `config.less`
```javascript
gulp.src('src/theme/config.less', { allowEmpty: true })
    .pipe(file('config.less', `@cdn: ~'${config.cdn}';`))
    .pipe(changed('src/theme'))
    .pipe(gulp.dest('src/theme'))
```
3. 使用 
```less
page {
  background-image: url('@{cdn}/index-bg.png');
  background-attachment: fixed;
}
```
