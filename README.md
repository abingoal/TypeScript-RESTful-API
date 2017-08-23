# TypeScript-RESTful-API

本教程详细介绍了如何使用`NodeJS`，`ExpressJS`和`TypeScript`开发RESTful API。

我们将使用`tsconfig.json`来配置项目，`Gulp`来处理自动化，`d.ts`用于管理npm的typings。

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

  1. `compilerOptions` 编译选项表示把TypeScript代码编译为es6标准，并且使用commonjs的模块方式。
  2. `include` 表示将要编译的ts代码目录
  3. `exclude` 排除不需要编译的目录

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

  1. 读取`tsconfig.json` 然后传递给`gulp-typescript`进行配置。
  2. 使用`gulp-typescript`编译项目并配置编译后的目录`dist`。
  3. 监听`.ts`文件的变动并实时编译。

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

现在测试下，删除`dist/test.js`，然后在项目根目录运行`gulp`，此时就可以看到编译器完美按照我们的配置进行了。

## 配置Express

安装`Express`和`debug`

``` bash
$ npm install express debug --save
```

在`TypeScript`中如果你使用了第三方包，则还需要下载相应的包定义文件。该文件会告诉编译器你正在使用的模块的结。

在`TypeScript 2.0`之前，处理`.d.ts`文件是一个很蛋疼的事情，`TypeScript`内置了`tsd`来处理，然后在文件中使用三斜杠添加引用。

`Typings`是作为`tsd`的替代者而出现的，通过`typings.json`配置可以辅助IDE，给出有智能的提示信息，以及重构的依据。

在`Typescript 2.0`之后，`TypeScript`将会默认的查看`./node_modules/@types`文件夹，自动从这里来获取模块的类型定义，当然了，你需要独立安装这个类型定义。

安装`Node`，`Express`和`debug`的类型定义：

``` bash
$ npm install @types/node @types/express @types/debug --save-dev
```

我们已经准备好创建HTTP服务器了。将`src/test.ts`重命名为`src/bin/www.ts`，删除控制台日志，并添加以下内容：

``` javascript
import * as debug from 'debug';
import * as http from 'http';

import App from '../app';

const debugging = debug('gameapi:server');

const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * 标准化端口号
 *
 * @param {(number|string)} val 端口号
 * @returns {(number|string|boolean)} 返回值
 */
function normalizePort(val: number|string): number|string|boolean {
  const normalizeport: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(normalizeport)) {
    return val;
  } else if (normalizeport >= 0) {
    return normalizeport;
  }else {
    return false;
  }
}
/**
 * 错误处理
 *
 * @param {NodeJS.ErrnoException} error 抛出异常
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} 需要提升权限`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} 已经在使用中`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * 监听端口
 *
 */
function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debugging(`Listening on ${bind}`);
}

```

如果你使用了带有代码检查之类的IDE(vs或vsc之类的)，会报出一个找不到App模块的错误，现在先不用管它。先看下刚才创建的文件内容：

1. 使用`debug`模块以在终端中打印调试日志。
2. 从环境变量中获取端口号，或者自己设置为3000。
3. 创建Http服务器，然后将app传给它。
4. 设置一些基本的错误处理和程序监听处理。

由于我们要从此文件来启动应用程序，因此可以在`package.json`中添加一个`start`的脚本来作为启动项。

``` javascript
"scripts": {
  "start": "node dist/bin/www"
},
```
程序入口写好了，然后我们就可以创建app.ts了。

``` bash
$ touch src/app.ts
$ npm install express body-parser morgan --save
$ npm install @types/body-parser @types/morgan --save-dev
```

在`app.ts`里面，我们创建一个App类来配置我们的Express服务器，最后把express实例导出。

``` javascript
import * as bodyParser from 'body-parser';
import * as debug from 'debug';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import baseRouter from './routes/baserouter';

const debugging = debug('gameapi:apps');
/**
 * 创建并配置ExpressJS Web服务器
 * @class App
 */
class App {

  // 引用Express实例
  public app: express.Application;
  // 在Express实例上运行配置方法
  constructor() {
    this.app = express();
    this.middleware();
  }

  // 配置Express中间件
  private middleware(): void {
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(baseRouter);
  }
}

export default new App().app;

```

这里我把路由中间件分离出去了，这样可以是代码结构更清晰，也方便之后的扩展。
(关于[路由](http://expressjs.com/en/starter/basic-routing.html)和[中间件](http://expressjs.com/en/guide/using-middleware.html)的详细信息可以参考express的[官方文档](http://expressjs.com/)。)

好了，现在我们可以检测下我们的代码能不能正常运行了。

编译代码:

``` bash
$ gulp scripts
$ npm start
```

然后在浏览器中输入:

```
http://127.0.0.1:3000
```

## 代码测试

作为一个优秀的开发者，代码中的测试时必不可少的。所以我们就需要使用TDD (test-driven development)来测试所编写的代码。

本例中使用Mocha和Chai创建测试。

首先我们先安装测试包依赖：

``` bash
$ npm install mocha chai chai-http --save-dev
$ npm install @types/mocha @types/chai @types/chai-http --save-dev
```

由于`mocha`只能理解JavaScript代码，因此我们所写的ts代码会不被mocha认可，需要其他方式来实现这个功能。

本例子中我们就是用`ts-node`来转换代码提供给mocha进行测试。

首先依然是安装依赖:

``` bash
$ npm install ts-node --save-dev
```

然后在`package.json`中添加`test`脚本,使用`ts-node`来运行mocha。

``` bash
"scripts": {
  "start": "node dist/bin/www",
  "test": "mocha --reporter spec --compilers ts:ts-node/register 'test/**/*.test.ts'"
},
```

所有环境设置好之后，我们就可以在 `baserouter` 中添加路由了。

``` javascript
import { NextFunction, Request, Response, Router } from 'express';
import app from '../app';
import userRouter from '../routes/userrouter';

class BaseRouter {
  public router: Router = Router();
  constructor() {
    this.init();
  }
  private init() {
    this.router
      .get('/', (req: Request, res: Response, next: NextFunction) => {
        res.json({ message: 'Hello World' });
      });
    this.router.use('/api/v1/users', userRouter);
  }
}

export default new BaseRouter().router;

```
这里我们写一个简单的路由，访问首页的时候返回一个JSON对象`{ message: 'Hello World' }`。

然后在根目录创建一个`test`文件夹,并添加一个文件，命名为`hello.test.ts`。(这里注意你的命名方式，需要和`package.json`中配置的测试脚本命名匹配)

``` javascript
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as mocha from 'mocha';

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

  it('should be json', () => {
    return chai.request(app).get('/')
    .then((res) => {
      expect(res.type).to.eql('application/json');
    });
  });

  it('should have a message prop', () => {
    return chai.request(app).get('/')
    .then((res) => {
      expect(res.body.message).to.eql('Hello World!');
    });
  });

});

```

然后在命令行中输入`npm test`, 这是应该能看到`baseRoute`的代码测试描述，并且都通过了检测。
(当然在此之前你可能会遇到错误，因为我在例子中使用了数据库连接，因此需要配置下数据库才能访问，不过你也可以先删掉数据库的连接，只去测试正常情况下的代码)

同样的，我们也可以创建其他路由来检测，例如我在路由文件夹下新建了`userrouter.ts`，该路由中有一个路由器，通过`userid`来获取用户信息，并返回 id 和 name 字段。

这样我们可以新建一个`user.test.ts`来测试我们的用户API接口。

``` javascript
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as mocha from 'mocha';

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/users', () => {

  it('responds with JSON array', () => {
    return chai.request(app).get('/api/v1/users')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(5);
      });
  });

  it('should include abing', () => {
    return chai.request(app).get('/api/v1/users')
      .then((res) => {
        const abing = res.body.find((user) => user.name === 'abing');
        expect(abing).to.exist;
        expect(abing).to.have.all.keys([
          'id',
          'name'
        ]);
      });
  });

});
describe('GET api/v1/users/:id', () => {

  it('responds with single JSON object', () => {
    return chai.request(app).get('/api/v1/users/1')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
      });
  });

  it('should return abing', () => {
    return chai.request(app).get('/api/v1/users/1')
      .then((res) => {
        expect(res.body.hero.name).to.equal('abing');
      });
  });

});

```

此时再运行 `npm test`，你可以看到命令行中的结果：

``` bash
baseRoute
  ✓ should be json
  ✓ should have a message prop

GET api/v1/users
  ✓ responds with JSON array
  ✓ should include abing
```

`mocha`的详细文档可查看[https://mochajs.org/](https://mochajs.org/)

