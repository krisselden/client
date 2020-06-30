'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const parseFlag = require('./config/parse-flag');
const env = EmberApp.env();
const broccoliAssetRevDefaults = require('broccoli-asset-rev/lib/default-options');

module.exports = function(defaults) {
  let options = {
    inlineContent: {},
    'ember-cli-uglify': {
      enabled: true,
      async: true, // run uglify in parallel

      uglify: {
        compress: {
          // this is adversely affects heuristics for IIFE eval
          'negate_iife': false,
          // limit sequences because of memory issues during parsing
          sequences: 0,
        },
        mangle: false,
        output: {
          // no difference in size and much easier to debug
          semicolons: false,
        },
      }
    },
    minifyCSS: {},
    fingerprint: {
      extensions: broccoliAssetRevDefaults.extensions.concat(['svg'])
    },
    sourcemaps: {
      extensions: ['js']
    }
  };

  // if (parseFlag('FAVICON', true)) {
  //   options.inlineContent['snippets/favicon'] = 'app/snippets/favicon.html';
  // }

  // if (parseFlag('EXTERNAL_FONTS', true)) {
  //   options.inlineContent['snippets/external-fonts'] = 'app/snippets/external-fonts.html';
  // }

  // if (parseFlag('REPORT_ERRORS', env === 'production')) {
  //   options.inlineContent['snippets/trackjs'] = 'app/snippets/trackjs.html';
  // }

  options.inlineContent['snippets/perf-utils'] = 'app/snippets/perf-utils.js';

  // options['ember-cli-uglify'].enabled = parseFlag('MINIFY_JS', env === 'production');

  options.minifyCSS.enabled = true;

  options.sourcemaps.enabled = false;

  options.fingerprint.enabled = false;

  let app = new EmberApp(defaults, options);

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('node_modules/dompurify/dist/purify.js', {
    using: [
      { transformation: 'amd', as: 'dom-purify' }
    ]
  });

  return app.toTree();
};
