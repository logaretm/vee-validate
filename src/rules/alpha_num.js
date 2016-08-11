export default (value) => ! Array.isArray(value) && /^[a-zA-Z0-9]*$/.test(value);
