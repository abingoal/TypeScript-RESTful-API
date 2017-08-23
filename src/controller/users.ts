import { NextFunction, Request, Response } from "express";
import * as _ from 'lodash';
import msgCode from '../libs/msgcode';
import dbUser from '../service/users';

class Users {
  /**
   * 根据ID获取用户信息
   *
   * @param {Request} req 请求
   * @param {Response} res 响应
   * @param {NextFunction} next 下一步
   * @memberof Users
   */
  public static userInfo(req: Request, res: Response, next: NextFunction) {
    const userid = parseInt(req.params.userid, 10);
    dbUser.userInfo(userid).then((result) => {
      res.json(result);
    }).catch((err) => {
      console.error(err);
    });
  }
}
export default Users;
