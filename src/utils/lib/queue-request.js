const q = require('./queue');

function queueRequest(request, concurrency = 10) {
  if (typeof request !== 'function') {
    throw Error('request must be function')
  }
  const queue = q((task, callback) => task(callback), concurrency)
  return (obj, _callback) => {
    queue.push((callback) => {
      const originComplete = obj.complete
      obj.complete = (...args) => {
        callback()
        if (typeof originComplete === 'function') {
          originComplete(...args)
        }
      }
      const task = request(obj);
      typeof _callback === 'function' && _callback(task);
    })
  }
}

function queue(concurrency) {
  const request = wx.request

  Object.defineProperty(wx, 'request', {
    get() {
      return queueRequest(request, concurrency)
    }
  })
}

module.exports = {
  queueRequest,
  queue,
}
