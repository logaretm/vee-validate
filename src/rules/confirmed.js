export default (value, [confirmedField], validatingField) => {
  const field = confirmedField
    ? document.querySelector(`input[name='${confirmedField}']`)
    : document.querySelector(`input[name='${validatingField}_confirmation']`);

  return !! (field && String(value) === field.value);
};
