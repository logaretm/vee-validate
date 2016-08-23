import test from 'ava';
import moment from 'moment';
import date from './../../src/plugins/date';

const validate = date.make(moment).after;

test('it checks if a date is after another date', t => {

});
