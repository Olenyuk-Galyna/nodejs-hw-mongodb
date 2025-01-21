import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOADS_DIR } from './constants/index.js';

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.static('uploads'));
  app.use(cors());
  app.use(cookieParser());

  // app.use(logger);
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(getEnvVar('PORT', '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
