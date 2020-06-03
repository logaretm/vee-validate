import { ValidationRuleFunction } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const sizeValidator: ValidationRuleFunction = (files: any, params) => {
  let size = getSingleParam(params, 'size');
  size = Number(size);
  if (isNaN(size)) {
    return false;
  }

  const nSize = size * 1024;
  if (!Array.isArray(files)) {
    return files.size <= nSize;
  }

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > nSize) {
      return false;
    }
  }

  return true;
};

export default sizeValidator;
