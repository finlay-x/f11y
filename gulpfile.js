const folderSlug = 'f11y'; // <-- Change this to the folder name/path to your repo

const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load gulp plugins
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const del = require('del');
const browsersync = require('browser-sync').create();
const { createGulpEsbuild } = require('gulp-esbuild');

const gulpEsbuild = createGulpEsbuild({
    incremental: true, // enables the esbuild's incremental build
    piping: true // enables piping
});

// Clean assets
function clear () {
    return process.env.NODE_ENV == 'development' ? del(['assets/scripts/**/*', 'assets/styles/**/*']) : del(['dist/scripts/**/*', 'dist/styles/**/*']);
}

// JS function
function js () {
    return src(['./src/js/app.js'])
        .pipe(
            gulpEsbuild({
                sourcemap: 'linked',
                minify: true,
                bundle: true,
                keepNames: false,
                outfile: 'f11y.min.js'
            })
        )
        .pipe(process.env.NODE_ENV == 'development' ? dest('assets/scripts/') : dest('dist/scripts/'));
}

// CSS function
function css () {
    if(process.env.NODE_ENV == 'production') return src('.', {"allowEmpty": true});

    const source = ['./src/scss/main.scss']

    return src(source, { sourcemaps: true })
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(
            postcss([
                autoprefixer({ overrideBrowserslist: ['last 2 versions'], cascade: false }),
                cssnano()
            ])
        )
        .pipe(rename({ basename: "f11y", extname: '.min.css' }))
        .pipe(dest('assets/styles/', { sourcemaps: '.' }));
}

// Setup Browsersync, requires XAMPP (or some PHP/Apache setup) to proxy for the PHP files
function browsersyncServe (cb) {
    browsersync.init({
        proxy: 'http://localhost/' + folderSlug + '/demo/' // Proxy the XAMPP path
    });
    cb();
}

// Browsersync Reload
function browsersyncReload (cb) {
    browsersync.reload();
    cb();
}

// Watch files
function watchFiles () {
    if(browsersync.active){
        watch('**/*.html', browsersyncReload);
        watch('**/*.php', browsersyncReload);
        watch('./src/scss/**/*.scss', series(css, browsersyncReload));
        watch('./src/js/**/*.js', series(js, browsersyncReload));
    } else{
        watch('**/*.html', browsersyncReload);
        watch('**/*.php');
        watch('./src/scss/**/*.scss', css);
        watch('./src/js/**/*.js', js);
    }
}

// Export Functions as Gulp tasks
exports.watch = series(clear, parallel(js, css), watchFiles);
exports.watch_browsersync = series(clear, browsersyncServe, parallel(js, css), watchFiles);
exports.build = series(clear, js, css, (done) => {
    //Force the node process to exit once task is done
    done();
    process.exit(0);
});