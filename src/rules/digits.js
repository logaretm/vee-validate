export default (value, [length]) => {
    const strVal = String(value);

    return !! (strVal.match(/^[0-9]*$/) && strVal.length === Number(length));
};
