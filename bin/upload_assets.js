/* eslint no-console: 0 */
const config = require('config');
const path = require('path');
const fs = require('fs');
const upload = require('./lib/upload');
const url = require('url');
const chalk = require('chalk');

const root = path.join(__dirname, '..');
const assetsPath = path.join(root, config.assetsPath);

module.exports = uploadAssets;

// 如果直接执行此文件，上传资源文件夹里的所有文件
if (require.main.filename === __filename) {
  uploadAssets(...getFiles(assetsPath)).catch(err => {
    console.error(err.stack);
  });
}

/**
 * @param {string[]} files
 */
async function uploadAssets(...files) {

  for (const file of files) {
    const relativePath = path.relative(assetsPath, file);
    if (relativePath[0] === '.') {
      console.log(`文件在资源文件夹外: ${file}`);
      continue;
    }
    if (!/\.(png|jpe?g)$/.test(file)) {
      console.log(`文件不是图片: ${file}`);
      continue;
    }
    const key = path.join(config.keyPrefix, relativePath);
    await upload.uploadFile(key, file);
    console.log(chalk.cyan(relativePath), chalk.gray('->'), chalk.green(url.resolve(config.cdnUpload, key)));
  }
}

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  const result = [];
  for (const file of files) {
    const realpath = path.join(dir, file);
    const stat = fs.statSync(realpath);
    if (stat.isDirectory()) {
      result.push(...getFiles(realpath));
    }
    if (stat.isFile()) {
      result.push(realpath);
    }
  }
  return result;
}
