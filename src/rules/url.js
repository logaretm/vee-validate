import isURL from 'validator/lib/isURL';

export default (value, domains) => isURL(value, { host_whitelist: domains || false });
