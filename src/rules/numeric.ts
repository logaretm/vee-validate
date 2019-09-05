import { StringOrNumber } from '../types';

const ar = /^[٠١٢٣٤٥٦٧٨٩]+$/;
const en = /^[0-9]+$/;

const validate = (value: StringOrNumber | StringOrNumber[]) => {
  const testValue = (val: StringOrNumber) => {
    const strValue = String(val);

    return en.test(strValue) || ar.test(strValue);
  };

  if (Array.isArray(value)) {
    return value.every(testValue);
  }

  return testValue(value);
};

export { validate };

export default {
  validate
};
