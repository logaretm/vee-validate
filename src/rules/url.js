import isURL from 'validator/lib/isURL';

export default (value, [domain] = [undefined]) =>
    isURL(value, { host_whitelist: domain ? [domain] : undefined });
