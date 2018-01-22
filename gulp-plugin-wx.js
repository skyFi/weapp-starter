const path = require('path');
const through = require('through-gulp');

module.exports = iconGeneration;

function iconGeneration({ wxPath }) {
  return through(function(file, encoding, callback) {
    let html = file.contents.toString('utf-8');
    const filepath = file.history && file.history[0];
    let wxRelativePath = path.relative(path.dirname(filepath), wxPath);
    const { dir } = path.parse(filepath);
    if (html.indexOf('/* global app */') !== -1) {
      // html = `${`const app = getApp();` + '\n'}${html}`;
      html = html.replace('/* global app */', 'const app = getApp();');
    }
    if (filepath !== wxPath
      && !/(utils\/lib)$/.test(dir)
      && !/(utils)$/.test(dir)
      && !/(common)$/.test(dir)
    ) {
      if (!/^\..*/.test(wxRelativePath)) {
        wxRelativePath = `./${wxRelativePath}`;
      }
      html = `${`import wx, { regeneratorRuntime } from '${wxRelativePath}';` + '\n'}${html}`;
    }
    file.contents = new Buffer(html);
    this.push(file);
    callback();
  }, (callback) => {
    // just pipe data next, just callback to indicate that the stream's over
    callback();
  }, 16);
}
