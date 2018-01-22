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

// 根据目录id获取排名列表
exports.getRanks = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee2(_ref2) {
    var categoryId = _ref2.categoryId,
        page = _ref2.page;
    var res, obj, ranks;
    return _wx.regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _wx2.default.request({
              url: '/ranks',
              data: {
                categoryId: categoryId,
                page: page
              }
            });

          case 2:
            res = _context2.sent;

            if (!res) {
              _context2.next = 7;
              break;
            }

            obj = res.data;
            // 格式化数据

            ranks = obj.data && obj.data.map(function (rank) {
              return {
                id: rank.schoolId,
                logo: rank.logo || '',
                rank: rank.rankValue || 0,
                chineseName: rank.chineseName || '',
                englishName: rank.englishName || '',
                location: rank.cityPath || '',
                averageAdmissionRate: rank.TIE_ADMINSSION_RATE || ''
              };
            }) || [];
            return _context2.abrupt('return', {
              categoryId: categoryId,
              count: obj.pagination && obj.pagination.count || 0,
              page: obj.pagination && obj.pagination.page || 1,
              ranks: ranks
            });

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x) {
    return _ref3.apply(this, arguments);
  };
}();

// 获取录取率测试人数
exports.getAdmssionRateCount = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee3() {
  var res;
  return _wx.regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res = _wx2.default.request({
            url: '/admission_rate/test_count'
          });
          return _context3.abrupt('return', res && res.data || 0);

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, undefined);
}));