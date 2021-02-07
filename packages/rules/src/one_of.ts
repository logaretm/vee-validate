const oneOfValidator = (value: unknown, list: unknown[]): boolean => {
  if (Array.isArray(value)) {
    return value.every(val => oneOfValidator(val, list));
  }

  return Array.from(list).some(item => {
    // eslint-disable-next-line
    return item == value;
  });
};

export default oneOfValidator;
