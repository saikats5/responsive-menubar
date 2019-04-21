// Initialize modules
const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// Sass task: compiles the style.scss file into style.css
gulp.task('sass', function () {
    return gulp.src('app/style.scss')
        .pipe(sass()) // compile SCSS to CSS
        .pipe(cssnano()) // minify CSS
        .pipe(gulp.dest('dist')) // put final CSS in dist folder
        .pipe(browserSync.stream());
});

// JS task: concatenates and uglifies JS files to script.js
gulp.task('js', function () {
    return gulp.src(['app/js/plugins/*.js', 'app/js/*.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

/* gulp.task('html', function () {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('dist')) // put final HTML in dist folder
        .pipe(browserSync.stream());
}); */

// Watch task: watch SCSS and JS files for changes
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch('app/*.scss', gulp.series('sass'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    //gulp.watch('app/*.html', gulp.series('html'));
});

// Default task
gulp.task('default', gulp.series('sass', 'js', 'watch'));
