import test from 'ava';
import moment from 'moment';
import before from './../../src/plugins/date/before';
import mocks from './../helpers';

const validate = before(moment);

test('it checks if a date is before another date', t => {
    const format = 'DD/MM/YYYY';

    mocks.querySelector({ value: '11/9/2016' });
    t.false(validate('12/9/2016', ['otherField', format]));
    t.true(validate('10/9/2016', ['otherField', format]));
});

test('it fails validation if any date is invalid', t => {
    const format = 'DD/MM/YYYY';
    mocks.querySelector({ value: '11/15/2016' }); // invalid target value.
    t.false(validate('12/9/2016', ['otherField', format]));

    mocks.querySelector({ value: '11/9/2016' });
    t.false(validate('32/08/2016', ['otherField', format])); // invalid value.
});
