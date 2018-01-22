'use strict';

var config = require('../common/config');
var queueRequest = require('./lib/queue-request').queueRequest;

function getToken() {
  var token = void 0;
  if (!token) {
    token = wx.getStorageSync('token');
  }
  return token;
}

var request = function request(option) {
  var method = option.method || 'GET';
  var url = '' + config.api + option.url;
  var _timeFormat = 'YYYY-MM-DD HH:mm:ss';
  if (option.timeFormat) {
    _timeFormat = option.timeFormat;
  }
  var _data = Object.assign({}, option.data, { _timeFormat: _timeFormat, _fromNow: '2d' });
  var token = getToken();
  var header = Object.assign({}, {
    'x-hdk-token': token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, option.header);
  return new Promise(function (resolve, reject) {
    queueRequest(wx.request, 5)({
      url: url,
      data: _data,
      header: header,
      method: method,
      success: function success(res) {
        var data = res.data || {};
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            reject(data);
          }
          return;
        }
        var code = data.code;
        var msg = data.msg;
        var err = data.err;
        console.log('\n', method + ': ' + url, _data, header, '\nRES:', res, '\n');
        if ('' + code === '0') {
          resolve(data);
        } else {
          wx.showToast({
            title: msg
          });

          // 假设需要登录的情况:
          if ('' + code === '6') {
            wx.removeStorageSync('token');
          }
          reject({
            errMsg: msg + '(' + code + ')'
          });
        }
      },
      fail: reject,
      complete: reject
    });
  });
};

var uploadFile = function uploadFile(option) {
  var _this = this;

  var method = option.method || 'POST';
  var url = '' + config.api.default + option.url;
  var _data = Object.assign({}, option.data, { timeFormat: 'YYYY-MM-DD HH:mm:ss' });
  var token = getToken();
  var header = Object.assign({}, {
    'x-hdk-token': token,
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
  }, option.header);
  var promises = [];
  return queueRequest(this.uploadFile, 5)({
    url: url,
    filePath: option.filePath,
    name: option.name || 'file',
    header: header,
    formData: _data,
    success: function success(res) {
      var data = res.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (error) {
          if (option.fail instanceof Function) {
            option.fail({
              errMsg: '上传文件失败'
            });
          }
          return;
        }
      }
      var code = data.code;
      var msg = data.msg;
      var err = data.err;
      console.log('\n', 'upload: ' + url, option, '\nRES:', res, '\n');
      if ('' + code === '0') {
        if (option.success instanceof Function) {
          option.success(data);
        }
      } else {
        _this.showToast({
          title: msg
        });
        if (option.fail instanceof Function) {
          option.fail({
            errMsg: msg + '(' + code + ')'
          });
        }
      }
    },
    fail: function fail(err) {
      if (option.fail instanceof Function) {
        option.fail(err);
      }
    },
    complete: function complete(rst) {
      if (option.complete instanceof Function) {
        option.complete(rst);
      }
    }
  }, function (resultTask) {
    typeof option.callback === 'function' && option.callback(resultTask);
  });
};

module.exports = {
  request: request,
  uploadFile: uploadFile
};