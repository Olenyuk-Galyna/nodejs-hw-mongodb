import { startServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';

import { TEMP_UPLOADS_DIR, UPLOADS_DIR } from './constants/index.js';
import { createDirIfNotExist } from './utils/createDirIfNotExist.js';

const bootstrap = async () => {
  await createDirIfNotExist(TEMP_UPLOADS_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
  await initMongoDB();
  startServer();
};
bootstrap();
