import moment from 'moment';
import after from './../../src/plugins/date/after';
import helpers from './../helpers';

const validate = after(moment);

it('checks if a date is after another date', () => {
    const format = 'DD/MM/YYYY';
    helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
    expect(validate('12/09/2016', ['otherField', format])).toBe(true);
    expect(validate('10/09/2016', ['otherField', format])).toBe(false);
});

it('fails validation if any date is invalid', () => {
    const format = 'DD/MM/YYYY';
    helpers.querySelector({ name: 'otherField', value: '11/15/2016' });
    expect(validate('12/09/2016', ['otherField', format])).toBe(false);

    helpers.querySelector({ name: 'otherField', value: '11/10/2016' });
    expect(validate('31/09/2016', ['otherField', format])).toBe(false); // invalid value.
});
