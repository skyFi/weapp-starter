'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = promisify;
exports.promisifyReturns = promisifyReturns;
var processFn = function processFn(fn, opts) {
  return function () {
    var _this = this;

    var P = opts.promiseModule;
    var args = new Array(arguments.length);

    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    return new P(function (resolve, reject) {
      if (opts.objectParams && (!args[0] || _typeof(args[0]) === 'object')) {
        args[0] = args[0] || {};
        args[0].success = function (result) {
          resolve(result);
        };
        args[0].fail = function (result) {
          reject(result);
        };
        args[0].complete = null;
      } else if (opts.errorFirst) {
        args.push(function (err, result) {
          if (opts.multiArgs) {
            var results = new Array(arguments.length - 1);

            for (var _i = 1; _i < arguments.length; _i++) {
              results[_i - 1] = arguments[_i];
            }

            if (err) {
              results.unshift(err);
              reject(results);
            } else {
              resolve(results);
            }
          } else if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } else {
        args.push(function (result) {
          if (opts.multiArgs) {
            var results = new Array(arguments.length - 1);

            for (var _i2 = 0; _i2 < arguments.length; _i2++) {
              results[_i2] = arguments[_i2];
            }

            resolve(results);
          } else {
            resolve(result);
          }
        });
      }

      fn.apply(_this, args);
    });
  };
};

function promisify(obj, opts) {
  opts = Object.assign({
    exclude: [/.+(Sync|Stream)$/],
    errorFirst: true,
    promiseModule: Promise
  }, opts);

  var filter = function filter(key) {
    var match = function match(pattern) {
      return typeof pattern === 'string' ? key === pattern : pattern.test(key);
    };
    return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
  };

  var ret = void 0;
  if (typeof obj === 'function') {
    ret = function ret() {
      if (opts.excludeMain) {
        return obj.apply(this, arguments);
      }

      return processFn(obj, opts).apply(this, arguments);
    };
  } else {
    ret = Object.create(Object.getPrototypeOf(obj));
  }

  for (var key in obj) {
    // eslint-disable-line guard-for-in
    var x = obj[key];
    ret[key] = typeof x === 'function' && filter(key) ? processFn(x, opts) : x;
  }

  return ret;
}

function promisifyReturns(fn, include) {
  return function () {
    var ret = fn.apply(undefined, arguments);
    for (var key in include) {
      var x = ret[key];
      ret[key] = typeof x === 'function' ? promisify(x, include[key]) : x;
    }
    return ret;
  };
}