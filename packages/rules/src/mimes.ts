import { ValidationRuleFunction } from '@vee-validate/shared';

const mimesValidator: ValidationRuleFunction = (files: File | File[], mimes) => {
  if (!mimes) {
    mimes = [];
  }

  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.type));
  }

  return regex.test(files.type);
};

export default mimesValidator;
