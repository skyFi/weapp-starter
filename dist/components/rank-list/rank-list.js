'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();

Component({
  properties: {
    data: {
      type: 'Array',
      value: [],
      observer: function observer() {
        var newValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oldValue = arguments[1];

        this.setData({
          cardId: newValue.cardId,
          count: newValue.count || 0,
          ranks: newValue.ranks || [],
          last: !!newValue.last
        });
      }
    }
  },
  methods: {
    // 加载更多排名
    onShowMore: function onShowMore() {
      if (!this.data.last) {
        // 订阅
        app.EventListener.emit('showMoreRanks', {
          cardId: this.data.cardId,
          categoryId: this.data.categoryId,
          page: this.data.page
        });
      }
    },
    onAddCardCountry: function onAddCardCountry() {
      app.EventListener.emit('addCardCountry');
    },
    onAddCardCategory: function onAddCardCategory() {
      app.EventListener.emit('addCardCategory');
    }
  }
});