import test from 'ava';
import moment from 'moment';
import dateFormat from './../../src/plugins/date/date_format';

const validate = dateFormat(moment);

test('validates a date format', t => {
    t.true(validate('2010-10-20 04:30', ['YYYY-MM-DD HH:mm']));
    t.false(validate('2010-10-20 4:30', ['YYYY-MM-DD HH:mm']));
    t.false(validate('2010-10-20', ['YYYY-MM-DD HH:mm']));
    t.false(validate('2010-10-20 24:01', ['YYYY-MM-DD HH:mm']));
    t.false(validate('2010-10-20 4:61', ['YYYY-MM-DD HH:mm']));
});
