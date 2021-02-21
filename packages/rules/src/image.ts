import { isEmpty } from './utils';

const imageValidator = (files: unknown) => {
  if (isEmpty(files)) {
    return true;
  }

  const regex = /\.(jpg|svg|jpeg|png|bmp|gif|webp)$/i;
  if (Array.isArray(files)) {
    return files.every(file => regex.test((file as File).name));
  }

  return regex.test((files as File).name);
};

export default imageValidator;
