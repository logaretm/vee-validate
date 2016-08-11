export default (value) => ! Array.isArray(value) && /^[0-9]*$/.test(value);
