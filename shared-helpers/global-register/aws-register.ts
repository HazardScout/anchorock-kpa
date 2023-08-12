// register aws default configuration

import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(global.Promise);

AWS.config.update({
  region: 's3-external-1',
});
