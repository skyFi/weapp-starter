'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

var _wxRedux = require('../../utils/wxRedux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = getApp();


// Action Function
var _setName = function _setName(text) {
  return {
    type: 'pages/setname',
    _key: 'name',
    _value: text
  };
};

// Page config
var pageConfig = {
  data: {
    list: []
  },
  onLoad: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
      var _this = this;

      var list;
      return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return app.service.fetchList();

            case 2:
              list = _context.sent;

              if (list) {
                this.setData({ list: list });
              }
              if (this.setName instanceof Function) {
                setTimeout(function () {
                  _this.setName('微信小程序开发最佳实践');
                }, 500);
              }

            case 5:
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
Page((0, _wxRedux.connect)(function (state) {
  return {
    name: state.name || '这里有一个介绍'
  };
}, function (dispatch) {
  return {
    setName: function setName(text) {
      return dispatch(_setName(text));
    }
  };
})(pageConfig));