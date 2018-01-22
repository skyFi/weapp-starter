const path = require('path');
const through = require('through-gulp');

// exporting the plugin
module.exports = iconGeneration;

function iconGeneration({ themePath }) {
  // creating a stream through which each file will pass
  return through(function(file, encoding, callback) {
    let html = file.contents.toString('utf-8');
    const filepath = file.history && file.history[0];
    const themeRelativePath = path.relative(path.dirname(filepath), themePath);
    html = `${`@import '${themeRelativePath}';` + '\n'}${html}`;
    file.contents = new Buffer(html);
    this.push(file);
    callback();
  }, (callback) => {
    // just pipe data next, just callback to indicate that the stream's over
    callback();
  }, 16);
}
