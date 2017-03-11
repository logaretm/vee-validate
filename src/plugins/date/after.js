export default (moment) => (value, [targetField, format]) => {
  const field = document.querySelector(`input[name='${targetField}']`);
  const dateValue = moment(value, format, true);
  const otherValue = moment(field ? field.value : targetField, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isAfter(otherValue);
};
