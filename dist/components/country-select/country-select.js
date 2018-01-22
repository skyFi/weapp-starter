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
      // 处理数据
      observer: function observer() {
        var newValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.setData({
          countries: (newValue || []).map(function (country) {
            return {
              value: country.id,
              name: country.name,
              checked: false
            };
          })
        });
      }
    }
  },
  methods: {
    // 改变国家事件
    onChange: function onChange(e) {
      var value = e.detail.value;
      var countries = this.data.countries;
      countries.forEach(function (country, i) {
        if ('' + country.value === value) {
          countries[i].checked = true;
        } else {
          countries[i].checked = false;
        }
      });
      this.setData({
        countries: countries
      });
      // 触发改变国家的事件
      app.EventListener.emit('changeCountry', value);
    }
  }
});