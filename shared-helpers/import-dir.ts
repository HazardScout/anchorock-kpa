// eslint-disable-next-line import/no-extraneous-dependencies
import glob from 'glob';
import path from 'path';

/**
 * pass the directory to start matching.
 * If a file is passed, that file will be ignored and it's directory will be used.
 */
export default (_dirOrFile = '', fileEndsWith = '*.ts', recursive = true):any[] => {
  const isFile = !!path.extname(_dirOrFile);
  const dir = isFile ? path.dirname(_dirOrFile) : _dirOrFile;
  let globPath = path.join(dir, '/**/', fileEndsWith);

  if (!recursive) {
    globPath = path.join(dir, fileEndsWith);
  }
  const requiredIn = glob.sync(globPath, {
    ignore: isFile ? _dirOrFile : undefined,
  }).map((file) => {
    try {
      // eslint-disable-next-line global-require
      const reqd = require(path.resolve(file));
      return reqd.default || reqd;
    } catch (requiredError) {
      console.log('requiredError :>> ', path.resolve(file), String(requiredError));
    }
  });

  return requiredIn.filter(rqd => rqd);
};

export const parentDir = (dir = '') => {
  return path.join(dir, '..');
};
