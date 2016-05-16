var fs = require('fs');
var path = require('path');
var CachingWriter = require('broccoli-caching-writer');
var mkdirp = require('mkdirp');

module.exports = BroccoliInlineCSS;
BroccoliInlineCSS.prototype = Object.create(CachingWriter.prototype);
BroccoliInlineCSS.prototype.constructor = BroccoliInlineCSS;

// input node 0 = wintersmith
// input node 1 = css
function BroccoliInlineCSS(inputNodes, templateFileName, cssFileName, options) {
  options = options || {};
  this.templateFileName = templateFileName;
  this.cssFileName = cssFileName;
  CachingWriter.call(this, inputNodes, {
    annotation: options.annotation
  });
}

BroccoliInlineCSS.prototype.build = function() {
  var REPLACE_STR = '<link href="/' + this.cssFileName + '" rel="stylesheet" type="text/css" media="all">';
  var cssToInline, templateFileWithStyleTag;
  var cssFile = path.join(this.inputPaths[1], this.cssFileName);
  var templateFile = path.join(this.inputPaths[0], this.templateFileName);
  var destFile = path.join(this.outputPath, this.templateFileName);
  mkdirp.sync(path.dirname(destFile));
  cssToInline = fs.readFileSync(cssFile).toString('utf8');
  cssToInline = cssToInline.replace(/@charset[^;]+;/g,'');  // not AMP-valid
  cssToInline = cssToInline.replace(/@page[^}]+}/g,'');     // not AMP-valid
  cssToInline = cssToInline.replace(/!important/g,'');      // not AMP-valid
  templateFileWithStyleTag = fs.readFileSync(templateFile).toString('utf8');
  templateFileWithStyleTag = templateFileWithStyleTag.replace(REPLACE_STR,
      ('<style amp-custom>' + cssToInline + '</style>'));
  fs.writeFileSync(destFile, templateFileWithStyleTag);
};
