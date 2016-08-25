import test from 'ava';
import moment from 'moment';
import after from './../../src/plugins/date/after';
import mocks from './../helpers';

const validate = after(moment);

test('it checks if a date is after another date', t => {
    mocks.querySelector({ value: '11/9/2016' });
    t.true(validate('12/9/2016', 'otherField'));
    t.false(validate('10/9/2016', 'otherField'));
});
