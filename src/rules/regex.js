export default (value, [regex, ...flags]) => !! String(value).match(new RegExp(regex, flags));
