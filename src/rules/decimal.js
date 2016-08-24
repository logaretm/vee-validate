export default (value, [decimals] = ['*']) => {
    if (Array.isArray(value)) {
        return false;
    }

    if (value === null || value === undefined || value === '') {
        return true;
    }

    const regexPart = decimals === '*' ? '*' : `{0,${decimals}}`;
    const regex = new RegExp(`^[0-9]*.?[0-9]${regexPart}$`);

    if (! regex.test(value)) {
        return false;
    }

    return ! Number.isNaN(parseFloat(value));
};
