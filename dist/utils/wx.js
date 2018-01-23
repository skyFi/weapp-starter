'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.connect = exports.regeneratorRuntime = undefined;

var _runtime = require('./lib/runtime');

var _runtime2 = _interopRequireDefault(_runtime);

var _promisify = require('./lib/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _request2 = require('./request');

var _request3 = _interopRequireDefault(_request2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exceptProgramAPI = 'closeSocket\nstopRecord\ngetRecorderManager\npauseVoice\nstopVoice\npauseBackgroundAudio\nstopBackgroundAudio\ngetBackgroundAudioManager\ncreateAudioContext\ncreateInnerAudioContext\ncreateVideoContext\ncreateMapContext\ncanIUse\nhideToast\nhideLoading\nshowNavigationBarLoading\nhideNavigationBarLoading\nnavigateBack\ncreateAnimation\npageScrollTo\ncreateSelectorQuery\ncreateCanvasContext\ncreateContext\ndrawCanvas\nstopPullDownRefresh\ncreateSelectorQuery\ngetExtConfigSync\ncreateCameraContext\ncreateLivePlayerContext\ncreateLivePusherContext'; /* global wx*/


var exceptGameAPI = 'createImage\nloadFont\nsetPreferredFramesPerSecond\ngetFileSystemManager';

var promisifiedWxApi = (0, _promisify2.default)(wx, {
  objectParams: true,
  exclude: [/^on/, /^off/, /Sync$/, new RegExp(exceptProgramAPI.split(/\r\n|\r|\n/).join('|'), 'gi'), new RegExp(exceptGameAPI.split(/\r\n|\r|\n/).join('|'), 'gi')]
});

if (wx.createCameraContext) {
  promisifiedWxApi.createCameraContext = (0, _promisify.promisifyReturns)(wx.createCameraContext.bind(wx), {
    takePhoto: { objectParams: true },
    startRecord: { objectParams: true },
    stopRecord: { objectParams: true }
  });
}

if (wx.createLivePlayerContext) {
  promisifiedWxApi.createLivePlayerContext = (0, _promisify.promisifyReturns)(wx.createLivePlayerContext.bind(wx), {
    play: { objectParams: true },
    stop: { objectParams: true },
    mute: { objectParams: true },
    requestFullScreen: { objectParams: true },
    exitFullScreen: { objectParams: true }
  });
}

if (wx.createLivePusherContext) {
  promisifiedWxApi.createLivePusherContext = (0, _promisify.promisifyReturns)(wx.createLivePusherContext.bind(wx), {
    play: { objectParams: true },
    stop: { objectParams: true },
    mute: { objectParams: true },
    requestFullScreen: { objectParams: true },
    exitFullScreen: { objectParams: true }
  });
}

if (wx.getFileSystemManager) {
  promisifiedWxApi.getFileSystemManager = (0, _promisify.promisifyReturns)(wx.getFileSystemManager.bind(wx), {
    access: { objectParams: true },
    copyFile: { objectParams: true },
    getFileInfo: { objectParams: true },
    mkdir: { objectParams: true },
    rmdir: { objectParams: true },
    rename: { objectParams: true },
    readFile: { objectParams: true },
    readdir: { objectParams: true },
    saveFile: { objectParams: true },
    stat: { objectParams: true },
    writeFile: { objectParams: true },
    unlink: { objectParams: true }
  });
}

// 请求
promisifiedWxApi.request = _request3.default.request;
promisifiedWxApi.uploadFile = _request3.default.uploadFile;

exports.default = promisifiedWxApi;
var regeneratorRuntime = exports.regeneratorRuntime = _runtime2.default;
var connect = exports.connect = require('./wxRedux').connect;
var Provider = exports.Provider = require('./wxRedux').Provider;