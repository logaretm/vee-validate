import { getSingleParam, isEmpty } from './utils';

const sizeValidator = (files: unknown, params: [number | string] | { size: string | number }) => {
  if (isEmpty(files)) {
    return true;
  }

  let size = getSingleParam(params, 'size');
  size = Number(size);
  if (isNaN(size)) {
    return false;
  }

  const nSize = size * 1024;
  if (!Array.isArray(files)) {
    return (files as File).size <= nSize;
  }

  for (let i = 0; i < files.length; i++) {
    if ((files[i] as File).size > nSize) {
      return false;
    }
  }

  return true;
};

export default sizeValidator;
