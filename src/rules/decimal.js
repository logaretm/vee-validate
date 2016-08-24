export default (value, [decimals] = ['*']) => {
    if (Array.isArray(value)) {
        return false;
    }

    const regexPart = decimals === '*' ? '*' : `{0,${decimals}}`;
    const regex = new RegExp(`^[0-9]*(\.[0-9]${regexPart})?$`);

    return regex.test(value);
};
