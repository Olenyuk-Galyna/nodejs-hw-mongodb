import multer from 'multer';

import { TEMP_UPLOADS_DIR } from '../constants/index.JS';
import createError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOADS_DIR,
  filename: (req, file, cd) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cd(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cd) => {
  const extention = file.originalname.split('.').pop();
  if (extention === 'exe') {
    return cb(createError(400, 'file with .exe extention not allow'));
  }
  cd(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
