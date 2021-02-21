import { isEmpty } from './utils';

const extValidator = (files: unknown, extensions: string[]) => {
  if (isEmpty(files)) {
    return true;
  }

  if (!extensions) {
    extensions = [];
  }

  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test((file as File).name));
  }

  return regex.test((files as File).name);
};

export default extValidator;
