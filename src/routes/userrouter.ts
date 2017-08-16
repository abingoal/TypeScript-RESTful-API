import { NextFunction, Request, Response, Router } from 'express';
import users from '../controller/users';

export class UserRouter {
  public router: Router = Router();
  /**
   * User 路由
   * @memberof UserRouter
   */
  constructor() {
    this.init();
  }
  public init() {
    this.router
      .get('/:userid', users.userInfo);
  }
}

export default new UserRouter().router;
