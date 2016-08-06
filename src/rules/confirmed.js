export default (value, [confirmedField]) => {
    const field = document.querySelector(`input[name='${confirmedField}']`);

    return !! (field && String(value) === field.value);
};
