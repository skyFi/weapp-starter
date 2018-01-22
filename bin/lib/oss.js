/* eslint no-console: 0 */
const OSS = require('ali-oss').Wrapper;
const config = require('config').oss || {};

module.exports = (() => {
  try {
    return new OSS({
      endpoint: config.endpoint,
      accessKeyId: config.key,
      accessKeySecret: config.secret,
      bucket: config.bucket,
    });
  } catch (err) {
    console.error('Error loading oss', err.message || err);
  }
})();
