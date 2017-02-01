export default (moment) => (value, [min, max, format]) => {
  const minDate = moment(min, format, true);
  const maxDate = moment(max, format, true);
  const dateVal = moment(value, format, true);

  if (! (minDate.isValid() && maxDate.isValid() && dateVal.isValid())) {
    return false;
  }

  return dateVal.isBetween(minDate, maxDate);
};
