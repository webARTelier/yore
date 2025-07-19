const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');



const paths = {
  js: {
    entry: './templates/js/main.js',
    output: './templates/js/',
    outputFile: 'main.min.js'
  },
  scss: {
    entry: './templates/scss/main.scss',
    input: './templates/scss/**/*.scss',
    output: './templates/css/',
    outputFile: 'main.min.css'
  }
}



const onError = (taskName) => notify.onError({
  title: `${taskName} Error`,
  message: '<%= error.message %>',
  sound: false
})



async function cleanJS() {
  await del([paths.js.output + paths.js.outputFile]);
}

async function cleanCSS() {
  await del([paths.scss.output + paths.scss.outputFile]);
}



async function buildJS() {
  
  try {
    const bundle = await rollup.rollup({
      input: paths.js.entry,
      plugins: [
        nodeResolve(),
        terser()
      ]
    });

    await bundle.write({
      file: paths.js.output + paths.js.outputFile,
      format: 'iife',
      name: 'yoreJS',
      sourcemap: false
    });

    console.log('✅ main.min.js wurde erfolgreich erstellt.');
  } catch (error) {
    console.error('❌ Fehler beim Bundlen mit Rollup:\n', error);
  }
}



function buildCSS() {
  return src(paths.scss.entry)
    .pipe(plumber({ errorHandler: onError('SCSS') }))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scss.output));
}



function watchFiles() {
  watch(paths.scss.input, function scssWatcher(cb) {
    series(cleanCSS, buildCSS)(cb);
  });

  watch(
    [
      './templates/js/**/*.js',
      '!./templates/js/main.min.js'
    ],
    function jsWatcher(cb) {
      series(cleanJS, buildJS)(cb);
    }
  )
}



exports.build = series(
  parallel(cleanJS, cleanCSS),
  parallel(buildJS, buildCSS)
)



exports.default = series(
  parallel(cleanJS, cleanCSS),
  parallel(buildJS, buildCSS),
  watchFiles
)
