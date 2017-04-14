export default (moment) => (value, [targetField, inclusion, format]) => {
  const field = document.querySelector(`input[name='${targetField}']`);
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  const dateValue = moment(value, format, true);
  const otherValue = moment(field ? field.value : targetField, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isBefore(otherValue) || (inclusion && dateValue.isSame(otherValue));
};
