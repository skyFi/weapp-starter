'use strict';

var _wx = require('./utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

var _redux = require('./utils/lib/redux');

var _reduxSaga = require('./utils/lib/redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _index = require('./sagas/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var initState = {};
var sagaMiddleware = (0, _reduxSaga2.default)({
  emitter: function emitter(emit) {
    return function (action) {
      if (Array.isArray(action)) {
        action.forEach(emit);
        return;
      }
      emit(action);
    };
  }
});
var store = (0, _redux.createStore)(_reducer2.default, initState, (0, _redux.applyMiddleware)(sagaMiddleware));
sagaMiddleware.run(_index2.default);

App((0, _wx.Provider)(store)({
  onLaunch: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
      var loginResult;
      return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _wx2.default.login();

            case 2:
              loginResult = _context.sent;

            case 3:
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
  }()
}
// const res = await wx.request({
//   url: '/schools'
// });
));