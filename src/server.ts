import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, () =>
  console.log('🔥 Server is running on http://localhost:3333')
);
