'use strict';

var q = require('./queue');

function queueRequest(request) {
  var concurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (typeof request !== 'function') {
    throw Error('request must be function');
  }
  var queue = q(function (task, callback) {
    return task(callback);
  }, concurrency);
  return function (obj, _callback) {
    queue.push(function (callback) {
      var originComplete = obj.complete;
      obj.complete = function () {
        callback();
        if (typeof originComplete === 'function') {
          originComplete.apply(undefined, arguments);
        }
      };
      var task = request(obj);
      typeof _callback === 'function' && _callback(task);
    });
  };
}

function queue(concurrency) {
  var request = wx.request;

  Object.defineProperty(wx, 'request', {
    get: function get() {
      return queueRequest(request, concurrency);
    }
  });
}

module.exports = {
  queueRequest: queueRequest,
  queue: queue
};