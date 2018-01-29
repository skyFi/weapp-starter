const path = require('path');
const through = require('through-gulp');
const uploadFile = require('./bin/upload_assets');

module.exports = iconGeneration;

function iconGeneration() {
  return through(async function(file, encoding, callback) {
    let html = file.contents.toString('utf-8');
    const filepath = file.history && file.history[0];
    try {
      await uploadFile(filepath);
    } catch (error) {
      console.error(error);
    }
    file.contents = new Buffer(html);
    this.push(file);
    callback();
  }, (callback) => {
    // just pipe data next, just callback to indicate that the stream's over
    callback();
  }, 16);
}
