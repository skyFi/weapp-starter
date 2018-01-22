'use strict';

var _wx = require('./utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

var _index = require('./actions/index');

var _index2 = _interopRequireDefault(_index);

var _redux = require('./utils/lib/redux');

var _wxRedux = require('./utils/wxRedux');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var initState = {}; // 初始化的 states
var store = (0, _redux.createStore)(_reducer2.default, initState);

App((0, _wxRedux.Provider)(store)({
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

            case 6:
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

  // 挂载所有的 Actions
  Action: _index2.default
}));