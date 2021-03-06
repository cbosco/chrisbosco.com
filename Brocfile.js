var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var env = require('broccoli-env').getEnv();
var concat = require('broccoli-concat');
var compileSass = require('broccoli-sass');

var wintersmith = require('broccoli-wintersmith');
var PurifyCSS = require('./lib/broccoliPurifyCSS');
var InlineCSS = require('./lib/broccoliInlineCSS');
var wintersmithPublicOutput = 'wintersmith-src';

var appCss = 'styles';
var vendorFonts = 'node_modules';
var publicFiles = 'public';

// a bit of a hardcode/hack but we want to use foundation SCSS files directly
// and broccoli-bower does not find these files
var appAndVendorCss = mergeTrees(
        [appCss]
            .concat([
                'node_modules/foundation-sites/scss',
                'node_modules/font-awesome/scss'
            ]),
        {overwrite: true}
    );

appAndVendorCss = compileSass([appAndVendorCss], 'app.scss', 'assets/app.css');
if (env === 'production' || env === 'qa') {
    appAndVendorCss = new PurifyCSS([appAndVendorCss], ['./wintersmith-src/templates/**/*.ejs'], 'assets/app.css', 'assets/app.css', { minify: true/*, rejected: true */});
}

var vendorFontsFontAwesome = pickFiles(vendorFonts, {
    srcDir: 'font-awesome/fonts',
    destDir: 'assets'
});

// inline CSS into _head template
var inlinedWintersmithPublicOutputOverrides = new InlineCSS([wintersmithPublicOutput, appAndVendorCss], 'templates/_head.ejs', 'assets/app.css');

// build wintersmith contents
wintersmithPublicOutput = wintersmith(mergeTrees([wintersmithPublicOutput, inlinedWintersmithPublicOutputOverrides], { overwrite: true }));

module.exports = mergeTrees([appAndVendorCss, vendorFontsFontAwesome, publicFiles, wintersmithPublicOutput], { overwrite: true });
