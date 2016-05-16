var purify = require('purify-css');
var fs = require('fs');
var path = require('path');
var CachingWriter = require('broccoli-caching-writer');
var mkdirp = require('mkdirp');

module.exports = BroccoliPurifyCSS;
BroccoliPurifyCSS.prototype = Object.create(CachingWriter.prototype);
BroccoliPurifyCSS.prototype.constructor = BroccoliPurifyCSS;

function BroccoliPurifyCSS(inputNodes, inputContentGlobs, inputFileName, outputFileName, options) {
  options = options || {};
  this.options = options;
  this.inputFileName = inputFileName;
  this.outputFileName = outputFileName;
  this.inputContentGlobs = inputContentGlobs;
  CachingWriter.call(this, inputNodes, {
    annotation: options.annotation
  });
}

BroccoliPurifyCSS.prototype.build = function() {
  var purifiedCSS;
  var inputFile = path.join(this.inputPaths[0], this.inputFileName);
  var destFile = path.join(this.outputPath, this.outputFileName);
  // cache has been busted
  // do anything, for example:
  //   1. read from this.inputPaths
  //   2. do something based on the result
  //   3. and then, write to this.outputPath
  mkdirp.sync(path.dirname(destFile));
  purifiedCSS = purify(this.inputContentGlobs, fs.readFileSync(inputFile).toString('utf8'), this.options);
  return fs.writeFileSync(destFile, purifiedCSS);
};
