var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var env = require('broccoli-env').getEnv();
var concat = require('broccoli-concat');
var uglifyJavaScript = require('broccoli-uglify-js');
var compileES6 = require('broccoli-es6-concatenator');
var compileSass = require('broccoli-sass');

var wintersmith = require('broccoli-wintersmith');
var wintersmithPublicOutput = 'wintersmith-src';

var appJs = 'app';
var appCss = 'styles';
var vendorCss = 'bower_components';
var vendorFonts = 'bower_components';
var vendorImages = 'bower_components';
var publicFiles = 'public';

var vendorJs = mergeTrees(
        []
            .concat([
                'bower_components/angular',             // angular
                'bower_components/slick-carousel',
                'bower_components/angular-foundation',   // angular-foundation
                'bower_components/angular-slick',
                // jQuery required by slick-carousel
                'bower_components/jquery/dist'
            ]),
        { overwrite: true }
    );

vendorJs = concat( vendorJs, {
    inputFiles: [
        // jquery is used by slick without Angular.
        'jquery.js',

        'angular.js',

        //'mm-foundation-tpls.js',
        'slick/slick.js',   // slick-carousel
        'dist/slick.js'     // angular-slick
    ],
    outputFile: '/assets/vendor.js'
});

// 1. creates app namespace
// 2. makes sure bower deps. are not at same level
//    when concat with app JS
appJs = pickFiles(appJs, {
      srcDir: '/',
      destDir: 'app'
});

appJs = mergeTrees([appJs].concat(['bower_components/loader.js']), { overwrite: true });

appJs = compileES6(appJs, {
    loaderFile: 'loader.js',
    inputFiles: [
        'app/**/*.js'
    ],
    wrapInEval: false,
    outputFile: '/assets/app.js'
});

if (env === 'production') {
  vendorJs = uglifyJavaScript(vendorJs, {
    // mangle: false,
    // compress: false
  });
  appJs = uglifyJavaScript(appJs, {
    // mangle: false,
    // compress: false
  });
}


// package third party non-SASS CSS as SASS for
// easy importing (avoid natural CSS @import)
// http://www.stevesouders.com/blog/2009/04/09/dont-use-import/
vendorCss = concat( vendorCss, {
    inputFiles: [
        'slick-carousel/slick/slick.css'
    ],
    outputFile: '/app/vendor.scss'
});

// a bit of a hardcode/hack but we want to use foundation SCSS files directly
// and broccoli-bower does not find these files
var appAndVendorCss = mergeTrees(
        [appCss]
            .concat([
                'bower_components/foundation/scss',
                'bower_components/font-awesome/scss',
                vendorCss
            ]),
        {overwrite: true}
    );

if (env === 'production' || env === 'qa') {
    appAndVendorCss = compileSass([appAndVendorCss], 'app.scss', 'assets/app.css', {outputStyle: 'compressed'});
} else {
    appAndVendorCss = compileSass([appAndVendorCss], 'app.scss', 'assets/app.css');
}

var vendorFontsFontAwesome = pickFiles(vendorFonts, {
    srcDir: 'font-awesome/fonts',
    destDir: 'assets'
});

var vendorFontsSlick = pickFiles(vendorFonts, {
    srcDir: 'slick-carousel/slick/fonts',
    destDir: 'assets/fonts' // create nested fonts dir
});

var vendorImagesSlick = pickFiles(vendorImages, {
    srcDir: 'slick-carousel/slick',
    files: ['ajax-loader.gif'],
    destDir: 'assets'
});

// build wintersmith contents
wintersmithPublicOutput = wintersmith(wintersmithPublicOutput, {
    config: require('path').resolve('./wintersmith-src/config.json')
});

module.exports = mergeTrees([vendorJs, appJs, appAndVendorCss, vendorFontsFontAwesome, vendorFontsSlick, vendorImagesSlick, publicFiles, wintersmithPublicOutput], { overwrite: true });
