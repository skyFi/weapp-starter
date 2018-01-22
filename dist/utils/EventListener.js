'use strict';

var EventListener = {
  // 缓存值
  cache: {
    // uid用来标记handler
    _uid: 0
  },
  // 订阅
  on: function on() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    var cache = this.cache[type] || (this.cache[type] = {});
    // handler必须为函数
    if (typeof handler !== 'function') {
      return;
    }
    // 为handler生成uid
    handler.$uid = handler._uid || this.cache._uid++;
    // 加入事件队列
    cache[handler._uid] = handler;
  },
  // 发布
  emit: function emit() {
    var _this = this;

    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

    var cache = this.cache[type];
    // 没有任何handler则不进行任何处理
    if (!cache) {
      return;
    }
    // 依次执行绑定的handler
    Object.keys(cache).forEach(function (key) {
      var _cache$key;

      (_cache$key = cache[key]).call.apply(_cache$key, [_this].concat(params));
    });
  },
  // 取消订阅
  off: function off(type, handler) {
    var cache = this.cache[type];
    if (!handler || handler._uid) {
      return true;
    }
    // 移除相应handler
    !!cache && delete this.cache[type][handler._uid];
    // cache中没有该类型其他handler时 移除该类型
    return Object.keys(cache).length || delete this.cache[type];
  }
};

module.exports = EventListener;