export default (moment) => (value, [targetField, format]) => {
    const dateValue = moment(value, format);
    const field = document.querySelector(`input[name='${targetField}']`);

    if (! (dateValue.isValid() && field)) {
        return false;
    }

    const other = moment(field.value, format);

    if (! other.isValid()) {
        return false;
    }

    return dateValue.isAfter(other);
};
