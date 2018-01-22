'use strict';

var _wx = require('../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 获取国家的榜单和目录
exports.getCountryCategories = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
  var res, counties, integratedRankings;
  return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _wx2.default.request({
            url: '/rank/categories/index'
          });

        case 2:
          res = _context.sent;
          counties = [];

          if (res) {
            integratedRankings = res.data.integratedRankings;

            if (integratedRankings.length && integratedRankings.length > 0) {
              // 处理数据
              counties = integratedRankings.slice(0, 5).map(function (item) {
                return {
                  id: item.groupId,
                  name: item.groupName && item.groupName.replace('排名', '') || '',
                  rankings: item.rankings && item.rankings.length > 0 && item.rankings.map(function (ranking) {
                    return {
                      id: ranking.id,
                      name: '' + (ranking.year || '') + (ranking.type || '') + (ranking.title || '')
                    };
                  }) || []
                };
              });
            }
          }
          return _context.abrupt('return', counties);

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));