'use strict';

var _wx = require('../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 获取国家的榜单和目录
exports.fetchList = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
  var res;
  return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve(['优化小程序 `API`', '使用 async/await', '接入 `Redux` 管理页面数据流', '样式书写采用 `less` 预编译', '`wxs` 管理工具库', '按需加载，子页面分包（除却 `tab` 页面的其他页面）', '资源自动化管理']);
            }, 1000);
          });

        case 2:
          res = _context.sent;
          return _context.abrupt('return', res);

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));