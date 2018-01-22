'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Page({
  onLoad: function onLoad(options) {
    var id = options && options.id || 0;
    this.setData({
      id: id
    });
  }
});