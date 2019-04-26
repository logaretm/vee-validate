import { ensureArray } from '../utils';

const validate = (files, mimes) => {
  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
  return ensureArray(files).every(file => regex.test(file.type));
};

export {
  validate
};

export default {
  validate
};
