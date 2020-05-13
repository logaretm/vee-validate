const validate = (value: any, { length }: Record<string, any>): boolean => {
  length = Number(length);
  if (Array.isArray(value)) {
    return value.every(val => validate(val, { length }));
  }
  const strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === length;
};

const params = ['length'];

export { validate, params };

export default {
  validate,
  params,
};
