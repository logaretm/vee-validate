import isURL from 'validator/lib/isURL';

export default (value, [requireProtocol] = [true]) =>
    isURL(value, { require_protocol: !! requireProtocol });
