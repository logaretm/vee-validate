export default (moment) => (value, [format]) => moment(value, format, true).isValid();
