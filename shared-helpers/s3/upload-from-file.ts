import fs from 'fs';
import mime from 'mime';
import getS3, { defaultBucket } from './get-s3';

export default async (sourceFilepath:string, destinationS3Key, awsS3Options = {}) => {
  const stream = fs.createReadStream(sourceFilepath, { autoClose: true });
  const contentType = mime.lookup(sourceFilepath || '');

  const s3 = getS3();
  await s3.upload({
    Key: destinationS3Key,
    Body: stream,
    ContentType: contentType,
    Bucket: defaultBucket,
    ...awsS3Options,
  }).promise();

  return destinationS3Key;
};
