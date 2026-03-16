import { api } from './api';
import COS from 'cos-js-sdk-v5';
import type { COSCredentials } from '@/types';

export const uploadApi = {
  getCredential() {
    return api.post<COSCredentials>('/api/common/getCredential', {});
  },

  async uploadFile(file: File, key: string, credentials: COSCredentials): Promise<string> {
    const cos = new COS({
      SecretId: credentials.credentials.tmpSecretId,
      SecretKey: credentials.credentials.tmpSecretKey,
      SecurityToken: credentials.credentials.sessionToken,
      StartTime: Date.now() / 1000 - 60,
      ExpiredTime: credentials.expiredTime,
    });

    return new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: credentials.bucket,
          Region: credentials.region,
          Key: key,
          Body: file,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(`${credentials.cdnUrl}/${key}`);
          }
        }
      );
    });
  },
};
