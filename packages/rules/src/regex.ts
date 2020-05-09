const validate = (value: any, { regex }: Record<string, any>): boolean => {
  if (typeof regex === 'string') {
    regex = new RegExp(value);
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, { regex: regex }));
  }

  return regex.test(String(value));
};

const params = ['regex'];

export { validate, params };

export default {
  validate,
  params,
};
