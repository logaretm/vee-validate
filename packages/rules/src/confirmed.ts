const validate = (value: any, { target }: Record<string, any>) => String(value) === String(target);

const params = ['target'];

export { validate, params };

export default {
  validate,
  params,
};
