export default (value, [length]) => {
  const strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};
