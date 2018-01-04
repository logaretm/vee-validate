const validate = (value, [length]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, [length]));
  }
  const strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

export default validate;
