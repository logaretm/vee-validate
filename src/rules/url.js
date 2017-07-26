import isURL from 'validator/lib/isURL';

export default (value, [requireProtocol] = [true]) => {
  const options = { require_protocol: !!requireProtocol, allow_underscores: true };
  if (Array.isArray(value)) {
    return value.every(val => isURL(val, options));
  }

  return isURL(value, options);
};
