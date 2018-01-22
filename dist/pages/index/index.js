'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = getApp();

Page({
  data: {
    _id: 0,
    counties: [],
    currentCountry: {},
    cards: [],
    scrollTop: 0
  },
  onLoad: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee() {
      var counties;
      return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return app.service.getCountryCategories();

            case 2:
              counties = _context.sent;

              // 初始化卡片
              this._addToCards({
                type: 'country-select',
                data: {}
              });
              this.setData({
                counties: counties
              });
              // 绑定分发函数
              this._bindEventListener();

            case 6:
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
  }(),

  // 添加新卡片
  _addToCards: function _addToCards(card) {
    var _this = this;

    if (!card) {
      return;
    }
    if (!card.data) {
      card.data = {};
    }
    card.data.cardId = card.id = this.data._id++;
    var cards = this.data.cards || (this.data.cards = []);
    cards.push(card);
    this.setData({ cards: cards });

    // 计算滚动位置
    var query = _wx2.default.createSelectorQuery();
    query.selectAll('.card-item').boundingClientRect();
    query.exec(function (res) {
      var totalHeight = 0;
      res[0].forEach(function (dom, index) {
        if (index < res[0].length - 1) {
          totalHeight += dom.height;
        }
      });
      _this.setData({
        scrollTop: totalHeight
      });
    });
  },

  // 绑定EventListener 监听各个组件行为
  _bindEventListener: function _bindEventListener() {
    var _this2 = this;

    // 国家改变事件
    app.EventListener.on('changeCountry', function (countryId) {
      // 数组映射成map
      var countriesMap = {};
      _this2.data.counties.forEach(function (country) {
        countriesMap[country.id] = country;
      });
      var currentCountry = countriesMap[countryId] || {};
      // 添加新卡片并设置当前国家
      _this2._addToCards({
        type: 'category-select',
        data: {
          country: currentCountry
        }
      });
      // 设置最新当前国家
      _this2.setData({
        currentCountry: currentCountry
      });
    });
    // 榜单改变事件
    app.EventListener.on('changeCategory', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee2(categoryId) {
        var data;
        return _wx.regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return app.service.getRanks({ categoryId: categoryId });

              case 2:
                data = _context2.sent;

                _this2._addToCards({
                  type: 'rank-list',
                  data: {
                    categoryId: data.categoryId,
                    page: data.page || 1,
                    count: data.count || 0,
                    ranks: data.ranks || [],
                    last: Math.ceil(_this2.count / 20) === _this2.page
                  }
                });

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    // 加载更多排名事件
    app.EventListener.on('showMoreRanks', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee3(_ref3) {
        var cardId = _ref3.cardId;

        var cards, _card$data$ranks, card, _card$data, categoryId, page, count, data;

        return _wx.regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // 找到目标卡片
                cards = _this2.data.cards.filter(function (card) {
                  return card.type === 'rank-list' && card.id === cardId;
                });
                // 更新卡片

                if (!(cards.length && cards.length > 0)) {
                  _context3.next = 13;
                  break;
                }

                card = cards[0] || {};
                _card$data = card.data, categoryId = _card$data.categoryId, page = _card$data.page, count = _card$data.count;

                if (!(Math.ceil(count / 20) === page)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt('return');

              case 6:
                _context3.next = 8;
                return app.service.getRanks({ categoryId: categoryId, page: page + 1 });

              case 8:
                data = _context3.sent;

                (_card$data$ranks = card.data.ranks).push.apply(_card$data$ranks, _toConsumableArray(data.ranks));
                card.data.page = page + 1;
                card.data.last = Math.ceil(count / 20) === page + 1;
                _this2.setData({
                  cards: _this2.data.cards
                });

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }());
    // 切换国家 添加国家卡片
    app.EventListener.on('addCardCountry', function () {
      _this2._addToCards({
        type: 'country-select',
        data: {}
      });
    });
    // 切换排名 添加榜单卡片
    app.EventListener.on('addCardCategory', function () {
      _this2._addToCards({
        type: 'category-select',
        data: {
          country: _this2.data.currentCountry
        }
      });
    });
  }
});