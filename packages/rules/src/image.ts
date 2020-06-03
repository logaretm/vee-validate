import { ValidationRuleFunction } from '@vee-validate/shared';

const imageValidator: ValidationRuleFunction = (files: File | File[]) => {
  const regex = /\.(jpg|svg|jpeg|png|bmp|gif)$/i;
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.name));
  }

  return regex.test(files.name);
};

export default imageValidator;
