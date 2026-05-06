import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from './env.js';

const projectRootPath = fileURLToPath(new URL('../../../', import.meta.url));
const normalizedUploadDir = env.UPLOAD_DIR.replace(/^\/+|\/+$/g, '') || 'uploads';

export const uploadConfig = {
  absoluteUploadDir: path.resolve(projectRootPath, normalizedUploadDir),
  publicMountPath: `/${normalizedUploadDir.replace(/\\/g, '/')}`,
  publicBaseUrl: env.SERVER_PUBLIC_URL.replace(/\/$/, ''),
  productImageMaxFileSizeBytes: env.PRODUCT_IMAGE_MAX_FILE_SIZE_MB * 1024 * 1024,
  productImageMaxFileSizeMb: env.PRODUCT_IMAGE_MAX_FILE_SIZE_MB,
  allowedImageMimeTypes: new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
};

export function buildPublicUploadUrl(relativePath) {
  const normalizedRelativePath = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');

  return `${uploadConfig.publicBaseUrl}${uploadConfig.publicMountPath}/${normalizedRelativePath}`;
}
