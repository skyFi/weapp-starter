'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  properties: {
    data: {
      type: 'Array',
      value: [],
      observer: function observer(newValue) {
        console.log(newValue);
        this.setData({
          name: newValue.name || '无国家',
          rankings: (newValue.rankings || []).map(function (ranking) {
            return {
              name: ranking.name,
              value: ranking.id,
              checked: false
            };
          })
        });
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
    }
  }
});