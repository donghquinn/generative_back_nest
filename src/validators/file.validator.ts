import { CommonError } from 'errors/common.error';
import { CommonLogger } from 'utilities/logger.util';

export const fileExtensionValidator = (fileName: string) => {
  if (!fileName.match(/\.(jpg|jpeg|png|srt)$/)) {
    throw new CommonError('[File] Upload Validation', 'Upload Requested File has unsupported extensions');
  }
  CommonLogger.info('[Upload] Uploading Images Validated Successfully.: %o', { fileName });

  return true;
};
