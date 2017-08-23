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
