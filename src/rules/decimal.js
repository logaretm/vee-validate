export default (value, [decimals] = ['*']) => {
    if (Array.isArray(value)) {
        return false;
    }

    if (value === null || value === undefined || value === '') {
        return true;
    }

    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

    if (! regex.test(value)) {
        return false;
    }

    return ! Number.isNaN(parseFloat(value));
};
