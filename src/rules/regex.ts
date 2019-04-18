const validate = (value: any, { expression }: any): boolean => {
  if (typeof expression === 'string') {
    expression = new RegExp(expression);
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, { expression }));
  }

  return expression.test(String(value));
};

const paramNames = ['expression'];

export {
  validate,
  paramNames
};

export default {
  validate,
  paramNames
};
