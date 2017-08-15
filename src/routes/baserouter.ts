import * as express from 'express';
import userRouter from '../routes/userrouter';

class BaseRouter {
  private app: express.Application;
  private router: express.Router;

  constructor(app: express.Application, router: express.Router) {
    this.app = app;
    this.router = router;
  }

  public init(): void {
    const router = express.Router();
    router.get('/', (req, res, next) => {
      res.json({ Hello: 'World' });
    });
    this.app.use('/', router);
    this.app.use('/api/v1/users', userRouter);
  }
}

export default BaseRouter;
