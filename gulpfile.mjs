import { src, dest, watch, series, parallel } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import del from 'del';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';



// Sass-Compiler initialisieren
const sass = gulpSass(dartSass);



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
};



const onError = (taskName) => notify.onError({
  title: `${taskName} Error`,
  message: '<%= error.message %>',
  sound: false
});



async function cleanJS() {
  await del([paths.js.output + paths.js.outputFile]);
}

async function cleanCSS() {
  await del([paths.scss.output + paths.scss.outputFile]);
}



async function buildJS() {
  try {
    const bundle = await rollup({
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

    console.log('✅ main.min.js was successfully created.');
  } catch (error) {
    console.error('❌ Error while bundling with Rollup:\n', error);
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
  );
}



export const build = series(
  parallel(cleanJS, cleanCSS),
  parallel(buildJS, buildCSS)
);

export default series(
  parallel(cleanJS, cleanCSS),
  parallel(buildJS, buildCSS),
  watchFiles
);
