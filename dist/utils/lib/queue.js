'use strict';

var checkConcurrency = function checkConcurrency() {
  var concurrency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (concurrency == null) {
    concurrency = 1;
  } else if (concurrency === 0) {
    throw new Error('Concurrency must not be zero');
  }
  return concurrency;
};

var onlyOnce = function onlyOnce(fn) {
  return function () {
    if (fn === null) {
      throw new Error('Callback was already called');
    }
    var callFn = fn;
    fn = null;
    return callFn.apply(undefined, arguments);
  };
};

module.exports = function queue(callback, concurrency) {
  checkConcurrency(concurrency);

  // 待处理的队列
  var workers = [];
  // 正在处理的队列
  var workerList = [];

  return {
    concurrency: concurrency,
    push: function push(task, callback) {
      var _this = this;

      workers.push({
        task: task,
        callback: callback
      });
      setTimeout(function () {
        _this.process();
      }, 0);
    },
    process: function process() {
      var _this2 = this;

      var _loop = function _loop() {
        var worker = workers.shift();
        workerList.push(worker);
        callback(worker.task, onlyOnce(function () {
          _this2.pull(worker);
          if (typeof worker.callback === 'function') {
            worker.callback.apply(worker, arguments);
          }
          _this2.process();
        }));
      };

      while (this.concurrency > workerList.length && workers.length) {
        _loop();
      }
    },
    pull: function pull(worker) {
      var index = workerList.indexOf(worker);
      if (index !== -1) {
        workerList.splice(index, 1);
      }
    }
  };
};