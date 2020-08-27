import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import routes from './routes';

import { handleError, ErrorHandler } from './app/helpers/error';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
  }
);

app.listen(3333, () =>
  console.log('🔥 Server is running on http://localhost:3333')
);
