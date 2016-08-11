export default (value, params) => {
    const isUrl = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\(\)%-]*)*\/?$/
    .test(value);

    const domain = params && params[0];

    if (domain && isUrl) {
        return new RegExp(`^https?:\/\/(([\da-z\.-]+)\.)*(${params[0].replace('.', '\\$&')})`)
        .test(value);
    }

    return isUrl;
};
