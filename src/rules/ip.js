import isIP from 'validator/lib/isIP';

export default (value, [version] = [4]) => isIP(value, version);
