var gulp = require('gulp');

var sass = require('gulp-sass');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var server = require('gulp-webserver');

//gulp-babel  ES6 ---> ES5  babel-preset-es2015必须下载

var babel = require('gulp-babel');

var url = require('url');

var fs = require('fs');

var path = require('path');

var swiperJson = require('./mock/swiper.json');

var searchJson = require('./mock/search.json');

//编译scss 压缩css
gulp.task('devCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
})

//监听scss

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('devCss'))
})

//压缩js
gulp.task('minJs', function() {
    return gulp.src(['./src/js/**/*.js', '!./src/js/libs/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build'))
})

//起服务

gulp.task('devserver', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090, //配置端口号
            middleware: function(req, res, next) { //拦截前端请求
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    res.end('');
                    return
                }

                console.log(pathname)

                if (pathname === '/api/swiper') {
                    res.end(JSON.stringify({ code: 1, data: swiperJson }))
                } else if (pathname === '/api/search') {
                    var key = url.parse(req.url, true).query.key;
                    var target = [];
                    //复 match
                    searchJson.forEach(function(item) {
                        if (item.title.match(key)) {
                            target.push(item);
                        }
                    })

                    res.end(JSON.stringify({ code: 1, data: target }))
                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;

                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }



            }
        }))
})

//开发环境

gulp.task('dev', gulp.series('devCss', 'devserver', 'minJs', 'watch'))