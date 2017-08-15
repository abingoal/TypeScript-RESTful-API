const gulp = require('gulp');
const ts = require('gulp-typescript');

const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// 读取TypeScript配置文件
const tsProject = ts.createProject('tsconfig.json');

/**
 * 编译ts-->js
 */
gulp.task('scripts', () => {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(gulp.dest('dist'));
});
/**
 * 监听任务
 */
gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});
/**
 * 拷贝资源
 */
gulp.task('assets', () => {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

/**
 * 默认任务
 */
gulp.task('default', ['watch', 'assets']);