export default (moment) => (value, [targetField, format]) => {
    const dateValue = moment(value, format);

    if (! dateValue.isValid()) {
        return false;
    }

    const other = moment(
        document.querySelector(`input[name='${targetField}']`).value,
        format
    );

    if (! other.isValid()) {
        return false;
    }

    return dateValue.isBefore(other);
};
