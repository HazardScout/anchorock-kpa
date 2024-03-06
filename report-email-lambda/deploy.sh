#!/bin/bash
set -eo pipefail

#Build Bucket
# BUCKET_ID=$(dd if=/dev/random bs=8 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n')
# BUCKET_NAME=lambda-artifacts-$BUCKET_ID
# echo $BUCKET_NAME > bucket-name.txt
# aws s3 mb s3://$BUCKET_NAME

#Build
mkdir -p lib/nodejs
rm -rf node_modules lib/nodejs/node_modules
npm install --omit=dev
mv node_modules lib/nodejs/

#Deploy
ARTIFACT_BUCKET=$(cat bucket-name.txt)
aws cloudformation package --template-file template.yml --s3-bucket $ARTIFACT_BUCKET --output-template-file out.yml
aws cloudformation deploy --template-file out.yml --stack-name report-email-lambda --capabilities CAPABILITY_NAMED_IAM

