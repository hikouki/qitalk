var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require("gulp-uglify");

gulp.task('build.min', function() {
    browserify({
        entries: [
            'src/qitalk.js',
        ],
        debug: false
    })
        .bundle()
        .pipe(source('qitalk.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dict'));
});

gulp.task('build.plain', function() {
    browserify({
        entries: [
            'src/qitalk.js',
        ]
    })
        .bundle()
        .pipe(source('qitalk.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dict'));
});

gulp.task('release', function() {
    browserify({
        entries: [
            'src/qitalk.js',
        ],
        debug: false
    })
        .bundle()
        .pipe(source('qitalk.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./release'));

    browserify({
        entries: [
            'src/qitalk.js',
        ]
    })
        .bundle()
        .pipe(source('qitalk.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./release'));
});

gulp.task('default', ['build.plain', 'build.min']);
