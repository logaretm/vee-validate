import test from 'ava';
import Validator from './../src/validation/validator';

const validator = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
});

test('it validates all values', t => {
    const result = validator.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'Winter is coming',
        content: 'John knows nothing',
        tags: 1
    });

    t.true(result);
    t.deepEqual(validator.errors, {});
});

test('it formats error messages', t => {
    const result = validator.validateAll({
        email: 'foo@bar.c',
        name: '',
        title: 'Wi',
        content: 'John knows nothing about this validator',
        tags: 4
    });

    t.false(result);
    t.deepEqual(validator.errors, {
        email: [
            'The email must be a valid email.'
        ],
        name: [
            'The name is required.',
            'The name must be at least 3 characters.'
        ],
        title: [
            'The title must be at least 3 characters.'
        ],
        content: [
            'The content may not be greater than 20 characters.'
        ],
        tags: [
            'The tags must be a valid value.'
        ]
    });
});

test('it can attach new rules', t => {
    validator.attach('field', 'required|min:5');
    t.false(validator.validate('field', 'less'));
    t.true(validator.validate('field', 'not less'));
});
