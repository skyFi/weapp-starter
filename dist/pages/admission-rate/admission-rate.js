'use strict';

var _wx = require('../../utils/wx.js');

var _wx2 = _interopRequireDefault(_wx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = getApp();

Page({
  data: {
    // 申请项目
    project: {
      currentIndex: 0,
      names: ['请选择', '本科', '研究生'],
      values: ['', 'MDT_BACHELOR', 'MDT_MASTER']
    }
    // grade: {
    //   currentIndex: 0,
    //   names: ['请选择', '']
    // }
    // 就读年级
    // grades: {
    //   name: ['高一', '高二', '高三', '大一']
    // }
  },
  onLoad: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_wx.regeneratorRuntime.mark(function _callee(options) {
      var _options$id, id, _options$schoolName, schoolName, count;

      return _wx.regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _options$id = options.id, id = _options$id === undefined ? 4 : _options$id, _options$schoolName = options.schoolName, schoolName = _options$schoolName === undefined ? '哈佛大学' : _options$schoolName;
              _context.next = 3;
              return app.service.getAdmssionRateCount();

            case 3:
              count = _context.sent;


              this.setData({
                id: id,
                schoolName: schoolName,
                testCount: count
              });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLoad(_x) {
      return _ref.apply(this, arguments);
    }

    return onLoad;
  }(),
  onProjectPickerChange: function onProjectPickerChange(e) {
    var project = this.data.project;
    project.currentIndex = e.detail.value;
    this.setData({
      project: project
    });
  }
});