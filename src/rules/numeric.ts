
const ar = /^[٠١٢٣٤٥٦٧٨٩]+$/;
const en = /^[0-9]+$/;

const validate = (value) => {
  const testValue = val => {
    const strValue = String(val);

    return en.test(strValue) || ar.test(strValue);
  };

  if (Array.isArray(value)) {
    return value.every(testValue);
  }

  return testValue(value);
};

export {
  validate
};

export default {
  validate
};
