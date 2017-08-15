import * as bodyParser from 'body-parser';
import * as debug from 'debug';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import BaseRouter from './routes/baserouter';

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
    this.routes();
  }

  // 配置Express中间件
  private middleware(): void {
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  // 配置API
  private routes(): void {
    const routes = new BaseRouter(this.app, express.Router());
    routes.init();
  }
}

export default new App().app;
