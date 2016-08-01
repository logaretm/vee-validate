export default {
    msg(name) {
        return `The ${name} must be a valid ip address.`;
    },
    // TODO: Maybe add an ipv6 flag?
    validate(value) {
        return !! value.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    }
};
