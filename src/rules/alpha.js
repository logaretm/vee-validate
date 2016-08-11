export default (value) => ! Array.isArray(value) && /^[a-zA-Z]*$/.test(value);
