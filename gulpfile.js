/**
 * Variable declaration
 * @type {Gulp|exports|module.exports}
 */
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    port = 9000;

/**
 * Creating default task for gulp
 */
gulp.task('default', function () {
    nodemon({
        script: 'bin/www',
        ext: 'js',
        env: {
            PORT: port
        },
        ignore: ['./node_modules/**']
    }).on('restart', function () {
        console.log('Server restarted and running on port ' + port);
    });
});
