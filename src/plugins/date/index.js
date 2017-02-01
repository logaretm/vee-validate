import after from './after';
import before from './before';
import date_format from './date_format'; // eslint-disable-line
import date_between from './date_between'; // eslint-disable-line
import messages from './messages';

export default {
  make: (moment) => ({
    date_format: date_format(moment),
    after: after(moment),
    before: before(moment),
    date_between: date_between(moment)
  }),
  messages,
  installed: false
};
