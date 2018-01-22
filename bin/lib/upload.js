/* eslint no-console: 0 */
const path = require('path');
const oss = require('./oss');
const crypto = require('crypto');
const fs = require('fs');
const Readable = require('stream').Readable;

const md5 = str => crypto.createHash('md5').update(str).digest('hex');

/**
 * 根据文件名生成cdn路径
 *
 * @param  {string} localFile 本地文件名
 * @param  {string} dir       cdn路径前缀（通常表示分类）
 * @param  {string} timestamp 一个时间值，用于保证本地重名文件不覆盖远端文件
 * @return {string}           cdn路径
 */
exports.generateUploadKey = (localFile, dir, timestamp) => {
  dir = dir.replace(/^\/?/, '/');
  localFile = localFile.split(/[#?]/g)[0];
  const r = timestamp ? md5(localFile + timestamp) : md5(localFile);
  const key = path.join(dir, r.slice(0, 2), r.slice(2, 4), r + path.extname(localFile));
  return key;
};

/**
 * 根据文件内容生成cdn路径
 *
 * @param  {string|Buffer} localFile 本地文件名，或文件内容
 * @param  {string}        dir       cdn路径前缀（通常表示分类）
 * @param  {string}        [extname] 文件扩展名，如：'.jpg'
 * @return {string}                  cdn路径
 */
exports.generateUploadKeyByContent = async (localFile, dir, extname) => {
  dir = dir.replace(/^\/?/, '/');
  if (typeof localFile === 'string') {
    localFile = localFile.split(/[#?]/g)[0];
    extname = path.extname(localFile);
  } else if (extname.length && extname[0] !== '.') {
    extname = `.${extname}`;
  }
  const r = await contentHash(localFile);
  const key = path.join(dir, r.slice(0, 2), r.slice(2, 4), r + extname);
  return key;
};

/**
 * @param {string} key cdn路径
 */
exports.existsFile = async (key) => {
  try {
    await oss.head(key.replace(/^\/?/, ''));
    return true;
  } catch (err) {
    if (err.name === 'NoSuchKeyError') { return false; }
    throw err;
  }
};


/**
 * OSS上传
 * @param {string} key
 * @param {string} localFile
 */
exports.uploadFile = async (key, localFile) => {
  try {
    await oss.put(key.replace(/^\/?/, ''), localFile, {
      headers: {
        'Content-Disposition': `attachment;filename=${encodeURIComponent(path.basename(localFile))}`,
      },
    });
  } catch (err) {
    throw err;
  }
};


/**
 * OSS上传，Buffer版本
 * @param {string} key
 * @param {Buffer} buf
 * @param {string} [originalFilename]
 */
exports.uploadBuffer = async (key, buf, originalFilename) => {
  try {
    if (originalFilename) {
      await oss.put(key.replace(/^\/?/, ''), buf, {
        headers: {
          'Content-Disposition': `attachment;filename=${encodeURIComponent(path.basename(originalFilename))}`,
        },
      });
    } else {
      await oss.put(key.replace(/^\/?/, ''), buf);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * OSS上传，Stream版本
 * @param {string} key
 * @param {Readable} stream
 * @param {number} [size]
 */
exports.uploadStream = async (key, stream, size) => {
  try {
    if (size) {
      await oss.putStream(key.replace(/^\/?/, ''), stream, { contentLength: size });
    } else {
      await oss.putStream(key.replace(/^\/?/, ''), stream);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * OSS上传，不需要提供key
 * @param {string} dir
 * @param {string} localFile
 * @return {Promise.<string>} key
 */
exports.uploadFileAuto = async (dir, localFile) => {
  const key = await exports.generateUploadKeyByContent(localFile, dir);
  await exports.uploadFile(key, localFile);
  return key;
};

/**
 * OSS上传，不需要提供key，Buffer版本
 * @param {string} dir
 * @param {Buffer} buf
 * @param {string} extname
 * @return {Promise.<string>} key
 */
exports.uploadBufferAuto = async (dir, buf, extname) => {
  const key = await exports.generateUploadKeyByContent(buf, dir, extname);
  await exports.uploadBuffer(key, buf);
  return key;
};


/**
 * 计算数据（文件、Buffer或流）的hash值
 * @param {string | Buffer | Readable} input
 * @return {string}
 */
async function contentHash(input) {
  if (typeof input === 'string') {
    const filesize = exports.filesize(input);
    if (filesize > 10 * (1 << 20)) { // > 10MB
      return await hashStream(fs.createReadStream(input));
    }
    return hashBuffer(await fs.readFileAsync(input));
  } else if (Buffer.isBuffer(input)) {
    return hashBuffer(input);
  } else if (input instanceof Readable) {
    return await hashStream(input);
  }

  function hashStream(stream) {
    return new Promise((resolve, reject) => {
      const hasher = crypto.createHash('md5');
      let length = 0;
      stream.on('error', err => { reject(err); });
      stream.on('data', data => { hasher.update(data); length += data.length; });
      stream.on('end', end => {
        resolve(hasher.digest('hex') + length.toString(16));
      });
    });
  }
  function hashBuffer(buffer) {
    const hasher = crypto.createHash('md5');
    hasher.update(buffer);
    return hasher.digest('hex') + buffer.length.toString(16);
  }
}