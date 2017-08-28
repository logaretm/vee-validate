export default (moment) => (value, [other, inclusion, format]) => {
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }

  const dateValue = moment(value, format, true);
  const otherValue = moment(other, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isAfter(otherValue) || (inclusion && dateValue.isSame(otherValue));
};
