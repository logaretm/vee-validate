import isURL from 'validator/lib/isURL';

export default (value, [domain]) => isURL(value, { host_whitelist: domain ? [domain] : undefined });
