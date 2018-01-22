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
        var oldValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var newCountry = newValue.country;
        var oldCountry = oldValue.country || {};
        if (newCountry.id !== oldCountry.id) {
          this.setData({
            name: newCountry.name || '无国家',
            rankings: (newCountry.rankings || []).map(function (ranking) {
              return {
                name: ranking.name,
                value: ranking.id,
                checked: false
              };
            })
          });
        }
      }
    }
  },
  methods: {
    onChange: function onChange(e) {
      var value = e.detail.value;
      var rankings = this.data.rankings;
      rankings.forEach(function (ranking, i) {
        if ('' + ranking.value === value) {
          rankings[i].checked = true;
        } else {
          rankings[i].checked = false;
        }
      });
      this.setData({
        rankings: rankings
      });
      // 分发榜单改变事件
      app.EventListener.emit('changeCategory', value);
    }
  }
});