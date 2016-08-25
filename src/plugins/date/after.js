export default (moment) => (value, [targetField, format]) => {
    if (! moment(value, format).isValid()) {
        return false;
    }

    const other = document.querySelector(`input[name='${targetField}']`).value;

    if (! moment(other, format).isValid()) {
        return false;
    }

    return moment(value, format).isAfter(other);
};
