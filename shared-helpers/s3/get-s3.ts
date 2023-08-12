import aws from 'aws-sdk';

export default ():aws.S3 => {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: 's3-external-1.amazonaws.com',
  });
  return s3;
};

export const defaultBucket = 'anchorock-uploads';
