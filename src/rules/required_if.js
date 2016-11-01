export default (value, [targetField, targetValue]) => {
    let field = document.querySelector(`input[name='${targetField}']`);

    if (field && ~['radio', 'checkbox'].indexOf(field.type)) {
        field = document.querySelector(`input[name='${targetField}']:checked`);
    }

    // No field, validation fails.
    if (! field) {
        return false;
    }

    // No validation applies.
    if (field && field.value !== targetValue) {
        return true;
    }

    // Field has target value, apply validation.
    if (field && field.value === targetValue) {
        if (Array.isArray(value)) {
            return !! value.length;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return !! String(value).trim().length;
    }

    return false;
};
