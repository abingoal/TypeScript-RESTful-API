import { NextFunction, Request, Response, Router } from 'express';
import users from '../controller/users';

export class UserRouter {
  public router: Router;
  /**
   * User 路由
   * @memberof UserRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }
  /**
   * 将所有的路由处理器附加到Express.Router上面
   */
  private init() {
    this.router.get('/:userid', users.userInfo);
  }
}

export default new UserRouter().router;
