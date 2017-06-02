export default (value, [confirmedField], validatingField) => {
  let field = confirmedField
    ? document.querySelector(`input[name='${confirmedField}']`)
    : document.querySelector(`input[name='${validatingField}_confirmation']`);

  if (! field) {
    field = confirmedField
      ? document.querySelector(`input[data-vv-name='${confirmedField}']`)
      : document.querySelector(`input[data-vv-name='${validatingField}_confirmation']`);
  }

  return !! (field && String(value) === field.value);
};
