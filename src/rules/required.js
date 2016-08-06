export default (value) => {
    if (Array.isArray(value)) {
        return !! value.length;
    }

    return !! String(value).length;
};
