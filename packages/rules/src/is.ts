const validate = (value: any, { other }: Record<string, any>) => {
  return value === other;
};

const params = ['other'];

export { validate, params };

export default {
  validate,
  params,
};
