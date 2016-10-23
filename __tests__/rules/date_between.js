import moment from 'moment';
import date_between from './../../src/plugins/date/date_between'; // eslint-disable-line

const validate = date_between(moment);

it('checks if a date is between two other dates', () => {
    const format = 'DD/MM/YYYY';

    expect(validate('16/09/2016', ['01/09/2016', '20/09/2016', format])).toBe(true);
    expect(validate('16/09/2016', ['01/9/2016', '15/09/2016', format])).toBe(false);
});


it('fails the valiadation if any date is in incorrect format', () => {
    const format = 'DD/MM/YYYY';

    expect(validate('09/16/2016', ['01/09/2016', '20/09/2016', format])).toBe(false); // invalid value.
    expect(validate('16/09/2016', ['199/10/2016', '20/09/2016', format])).toBe(false); // invalid low bound.
    expect(validate('16/09/2016', ['01/09/2016', '1/15/2016', format])).toBe(false); // invalid upper bound.
});
