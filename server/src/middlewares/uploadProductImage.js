import multer from 'multer';

import { uploadConfig } from '../config/uploads.js';
import { AppError } from '../utils/appError.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: uploadConfig.productImageMaxFileSizeBytes,
  },
  fileFilter: (_req, file, callback) => {
    if (!uploadConfig.allowedImageMimeTypes.has(file.mimetype)) {
      callback(new AppError('Only JPG, PNG, WEBP, and GIF product images are allowed', 400));
      return;
    }

    callback(null, true);
  },
});

export function uploadProductImage(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (error?.code === 'LIMIT_FILE_SIZE') {
      next(
        new AppError(
          `Product images must be ${uploadConfig.productImageMaxFileSizeMb} MB or smaller`,
          400,
        ),
      );
      return;
    }

    next(error);
  });
}
