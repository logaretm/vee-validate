export default (value, [domain] = []) => {
    const isUrl = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\(\)%-]*)*\/?$/
    .test(value);

    if (domain && isUrl) {
        return new RegExp(`^https?:\/\/(([\da-z\.-]+)\.)*(${domain.replace('.', '\\$&')})`)
        .test(value);
    }

    return isUrl;
};
