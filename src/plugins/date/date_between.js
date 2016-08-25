export default (moment) => (value, [min, max, format]) => moment(value, format).isBetween(min, max);
