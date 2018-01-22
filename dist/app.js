'use strict';

var _wx = require('./utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

var _index = require('./service/index');

var _index2 = _interopRequireDefault(_index);

var _EventListener = require('./utils/EventListener');

var _EventListener2 = _interopRequireDefault(_EventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

App({
  onLaunch: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
      var loginResult, res;
      return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _wx2.default.login();

            case 2:
              loginResult = _context.sent;
              _context.next = 5;
              return _wx2.default.request({
                url: '/schools'
              });

            case 5:
              res = _context.sent;

              console.log(res);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLaunch() {
      return _ref.apply(this, arguments);
    }

    return onLaunch;
  }(),

  // 服务
  service: _index2.default,
  // 事件广播
  EventListener: _EventListener2.default
});