import test from 'ava';
import Validator from './../src/validation/validator';

const validator = new Validator({
    email: 'email',
    name: 'required',
    title: 'min:3',
    content: 'max:10',
    tags: 'in:1,2,3,5'
});

test('it validates emails', t => {
    t.true(validator.validate('email', 'foo.12@bar.co.uk'));
    t.false(validator.validate('email', 'foo.12@bar.c'));
});

test('it validates min', t => {
    t.true(validator.validate('title', 'wow'));
    t.false(validator.validate('title', 'wo'));
});

test('it validates max', t => {
    t.true(validator.validate('content', 'not long'));
    t.false(validator.validate('content', 'this is some very long text'));
});

test('it validates required', t => {
    t.true(validator.validate('name', 'asjdj'));
    t.true(validator.validate('name', 0));
    t.false(validator.validate('name', ''));
    t.false(validator.validate('name', []));
});

test('it validates in array', t => {
    t.true(validator.validate('tags', 1));
    t.true(validator.validate('tags', 2));
    t.true(validator.validate('tags', 3));
    t.true(validator.validate('tags', 5));
    t.false(validator.validate('tags', 4));
});
