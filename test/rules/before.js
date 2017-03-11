import test from 'ava';
import moment from 'moment';
import before from './../../src/plugins/date/before';
import helpers from './../helpers';

const validate = before(moment);

test('checks if a date is before another date', t => {
    const format = 'DD/MM/YYYY';
    helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
    t.false(validate('12/09/2016', ['otherField', format]));
    t.true(validate('10/09/2016', ['otherField', format]));
});


test('it accepts dates instead of fields', t => {
    const format = 'DD/MM/YYYY';
    t.false(validate('12/09/2016', ['11/09/2016', format]));
    t.true(validate('10/09/2016', ['11/09/2016', format]));
});

test('fails validation if any date is invalid', t => {
    const format = 'DD/MM/YYYY';
    helpers.querySelector({ name: 'otherField', value: '11/15/2016' });
    t.false(validate('12/09/2016', ['otherField', format]));
    helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
    t.false(validate('32/08/2016', ['otherField', format])); // invalid value.
});
