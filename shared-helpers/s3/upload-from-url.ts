import axios from 'axios';
import path from 'path';
import mime from 'mime';
import getS3, { defaultBucket } from './get-s3';

export default async (sourceUrl:string, destinationS3Key:string, awsS3Options = {}) => {
  if (!destinationS3Key || !sourceUrl) {
    return null;
  }

  const { data: stream, headers } = await axios.get(sourceUrl, {
    responseType: 'stream',
  });

  const contentType = (
    path.extname(destinationS3Key)
      ? mime.lookup(destinationS3Key)
      : headers['content-type']
  );

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
