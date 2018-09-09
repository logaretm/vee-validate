const validate = (value, { expression }) => {
  if (typeof expression === 'string') {
    expression = new RegExp(expression);
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
