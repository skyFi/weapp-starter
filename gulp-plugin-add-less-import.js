const path = require('path');
const through = require('through-gulp');

// exporting the plugin
module.exports = iconGeneration;

function iconGeneration({ themePath, commomPath }) {
  // creating a stream through which each file will pass
  return through(function(file, encoding, callback) {
    let html = file.contents.toString('utf-8');
    const filepath = file.history && file.history[0];
    const fileDir = path.dirname(filepath);
    const themeRelativePath = path.relative(fileDir, themePath);
    const commonRelativePath = path.relative(fileDir, commomPath);
    const fileDirList = fileDir.split(/\//);
    const isComponents = fileDirList[fileDirList.length - 2] === 'components';
    if (isComponents) {
      html = `${`@import '${themeRelativePath}';` + '\n' + `@import '${commonRelativePath}';` + '\n'}${html}`;
    } else {
      html = `${`@import '${themeRelativePath}';` + '\n'}${html}`;
    }
    file.contents = new Buffer(html);
    this.push(file);
    callback();
  }, (callback) => {
    // just pipe data next, just callback to indicate that the stream's over
    callback();
  }, 16);
}
