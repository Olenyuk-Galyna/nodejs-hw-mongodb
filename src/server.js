import express from 'express';
import cors from 'cors';

import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(logger);

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(getEnvVar('PORT', '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
