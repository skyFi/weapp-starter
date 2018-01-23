'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = getApp();

// Page config
var pageConfig = {
  data: {
    list: [],
    introduction: '在小程序之初便开发应用了，现在小程序的开发也越来越成熟了，完善了很多的API、组件、架构等，社区也由原来的零星点点到现在的不大不小，但也算是有了，期间也诞生了很多的开发框架，越来越多的三方辅助库，我也捣鼓出很多。比较有名的算是 `wepy` 和 `labrador`，`wepy` 是 `vue` 风格的小程序开发框架，`labrador` 则比较亲和 `React`，各有千秋，也各有深坑，而 `labrador` 作者目前已经停止更新了 TnT，作为React深度使用者的我来说是忧伤的，于是我捣鼓出 [`wn-cli`](https://github.com/skyFi/weapp-native) 来用类 `React` 快速开发微信小程序，然而在这个过程中，想了很多，为什么需要开发框架呢？小程序本身在一开始就强调框架，且现在做的也不差，后来总结了下，无非是不熟悉小程序这套框架，但学习新的中间框架去开发小程序，这不是更加加大了熟悉成本吗？且出了问题增加了处理的代价。于是，我重新思考了下，最佳的微信小程序开发实践应该是无痛的，且舒服的，无痛的是指在小程序的飞速发展变更中，我们不用重复的浪费学习第三方框架和原生框架。舒服的是指，我们能用上我们熟悉的流行工程流，如：less 预编译、async/await 异步请求，redux数据管理等。'
  },
  onLoad: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
      return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.dispatch({
                type: 'pages/index',
                name: 'Skylor'
              });

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLoad() {
      return _ref.apply(this, arguments);
    }

    return onLoad;
  }()
};

// connect page & redux
Page((0, _wx.connect)(function (state) {
  return {
    name: state.name || '这里有一个介绍',
    favorites: (state.favorites || []).slice(0, 5)
  };
})(pageConfig));