export default (moment) => (value, [min, max, format]) => {
    const minDate = moment(min, format);
    const maxDate = moment(max, format);
    const dateVal = moment(value, format);

    if (! (minDate.isValid() && maxDate.isValid() && dateVal.isValid())) {
        return false;
    }

    return dateVal.isBetween(minDate, maxDate);
};
