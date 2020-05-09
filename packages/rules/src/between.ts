const validate = (value: any, { min, max }: Record<string, any> = {}): boolean => {
  if (Array.isArray(value)) {
    return value.every(val => !!validate(val, { min, max }));
  }

  return Number(min) <= value && Number(max) >= value;
};

const params = ['min', 'max'];

export { validate, params };

export default {
  validate,
  params,
};
