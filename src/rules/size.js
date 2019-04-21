import { ensureArray } from '../utils';

const validate = (files, [size]) => {
  if (isNaN(size)) {
    return false;
  }
  const nSize = Number(size) * 1024;
  return ensureArray(files).every(file => file.size <= nSize);
};

export {
  validate
};

export default {
  validate
};
