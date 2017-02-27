import moment from 'moment';
import before from './../../src/plugins/date/before';
import helpers from './../helpers';

const validate = before(moment);

it('checks if a date is before another date', () => {
    const format = 'DD/MM/YYYY';
    helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
    expect(validate('12/09/2016', ['otherField', format])).toBe(false);
    expect(validate('10/09/2016', ['otherField', format])).toBe(true);
});

it('fails validation if any date is invalid', () => {
    const format = 'DD/MM/YYYY';
    helpers.querySelector({ name: 'otherField', value: '11/15/2016' });
    expect(validate('12/09/2016', ['otherField', format])).toBe(false);
    helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
    expect(validate('32/08/2016', ['otherField', format])).toBe(false); // invalid value.
});
