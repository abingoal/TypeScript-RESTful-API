# TypeScript-RESTful-API

本教程详细介绍了如何使用NodeJS，ExpressJS和TypeScript开发RESTful API。

我们将使用tsconfig.json来配置项目，Gulp来处理自动化，d.ts用于管理npm的typings。

## 开始工作

项目在运行之前我们需要先将TypeScript转换成Javascript，因此先创建一个tsconfig.json文件，类似于package.json或.babelrc或者其他任何项目级配置文件。该文件指示了将如何编译.ts代码。

创建一个新目录保存项目，然后添加`tsconfig.json`文件

``` bash
$ mkdir typescript-restful-api
$ cd typescript-restful-api
$ touch tsconfig.json
```

我们只需要一些基本的配置即可

> 更详细的配置请参考官网给出的[编译配置](http://www.typescriptlang.org/docs/handbook/compiler-options.html)

``` json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

配置说明:

1、 `compilerOptions` 编译选项表示把TypeScript代码编译为es6标准，并且使用commonjs的模块方式
2、 `include` 表示将要编译的ts代码目录
3、 `exclude` 排除不需要编译的目录


创建一个`src`目录

``` bash
mkdir src
```

在进一步之前，我们先确认配置文件是否像我们预期的那样工作。

创建`package.json`文件，然后安装TypeScript

``` bash
$ npm init -y
$ npm install typescript --save-dev
```

在`src`目录中创建一个名为`test.ts`的新文件，并添加以下内容：

``` javascript
console.log('Hello, TypeScript!');
```

然后在项目根目录执行`tsc`来编译

如果`tsc`命令不加其他参数的话，它将会查看`tsconfig.json`中的配置，然后使用这些设置来构建项目。

此时你应该可以在`src`目录中看到名为`test.js`的文件。

现在编译器已经完美工作。但是每次编译总不能把源代码和编译后的代码放一起，因此我们需要修改下`tsconfig.json`。

在`compilerOptions`选项中加上`outDir`属性：
``` bash
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "dist"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```
好了，现在将`src`目录中的`test.js`删除，然后重新编译，此时`test.js`将会被编译到`dist`目录中。

但是这样每次都要手动编译很不友好，因此我们需要`Gulp`来做这些自动化的操作。

``` bash
$ npm install gulp gulp-typescript --save-dev
```

然后在项目根目录添加`gulpfile.js`文件，在这里我们会做以下几项操作:

1、 读取`tsconfig.json` 然后传递给`gulp-typescript`进行配置。
2、 使用`gulp-typescript`编译项目并配置编译后的目录`dist`。
3、 监听`.ts`文件的变动并实时编译。

`gulpfile.js` 的代码如下:

``` javascript
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
```

