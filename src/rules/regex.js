export default (value, [regex, ...flags]) => new RegExp(regex, flags).test(String(value));
