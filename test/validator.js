import test from 'ava';
import Validator from './../src/validator';

const validator = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
});

test('it can be initialized with static create method', t => {
    const validator2 = Validator.create();
    t.true(validator2 instanceof Validator);
});

test('it can be initialized without validations', t => {
    const validator2 = new Validator();
    t.true(validator2 instanceof Validator);
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
    t.deepEqual(validator.errorBag.all(), []);
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
    t.deepEqual(validator.errorBag.all(), [
        'The email must be a valid email.',
        'The name is required.',
        'The name must be at least 3 characters.',
        'The title must be at least 3 characters.',
        'The content may not be greater than 20 characters.',
        'The tags must be a valid value.'
    ]);
    t.deepEqual(validator.getErrors().all(), [
        'The email must be a valid email.',
        'The name is required.',
        'The name must be at least 3 characters.',
        'The title must be at least 3 characters.',
        'The content may not be greater than 20 characters.',
        'The tags must be a valid value.'
    ]);
});

test('it can attach new rules', t => {
    const otherValidator = new Validator();
    otherValidator.attach('field', 'required|min:5');
    t.false(otherValidator.validate('field', 'less'));
    t.true(otherValidator.validate('field', 'not less'));

    otherValidator.attach('someField', 'required|min:3');
    t.false(otherValidator.validate('someField', 'wo')); // add error.
    t.is(otherValidator.errorBag.count(), 1);

    // does it overwrite the old rule?
    otherValidator.attach('someField', 'min:1|max:3');
    t.is(otherValidator.errorBag.count(), 0);
    t.true(otherValidator.validate('someField', 'wo'));
    t.false(otherValidator.validate('someField', 'woww'));
});

test('it can detach rules', t => {
    validator.detach('field');
    t.falsy(validator.validations.field);
});
