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
    validator.attach('field', 'required|min:5');
    t.false(validator.validate('field', 'less'));
    t.true(validator.validate('field', 'not less'));
});

test('attaching new rules to an existing field should overwrite the old rules', t => {
    validator.attach('someField', 'required|min:3');
    t.false(validator.validate('someField', 'wo')); // add error.
    t.is(validator.errorBag.collect('someField').length, 1);

    // does it overwrite the old rule?
    validator.attach('someField', 'min:1|max:3');
    t.is(validator.errorBag.collect('someField').length, 0); // are field errors rest?
    t.true(validator.validate('someField', 'wo')); // was the old min validator overwritten?
    t.false(validator.validate('someField', 'woww')); // did the max validator work?
});

test('it can detach rules', t => {
    validator.detach('field');
    t.falsy(validator.validations.field);
});

test('it can extend the validators for a validator instance', t => {
    const truthy = {
        msg(field) {
            return `The ${field} value is not truthy.`;
        },
        validate(value) {
            return !! value;
        }
    };

    const falsy = {
        msg(field) {
            return `The ${field} value is not falsy.`;
        },
        validate(value) {
            return ! value;
        }
    };
    let otherValidator = new Validator();
    validator.extend('truthy', truthy); // instance extend.

    validator.attach('anotherField', 'truthy');
    t.true(validator.validate('anotherField', 1));
    t.false(validator.validate('anotherField', 0));
    t.truthy(Validator.create().rules.truthy); // new objects are also extended.
    t.truthy(otherValidator.rules.truthy); // current objects are also extended.

    Validator.extend('falsy', falsy); // static extend.

    otherValidator = new Validator();
    t.truthy(otherValidator.rules.falsy); // new Objects are extended.
    t.truthy(validator.rules.falsy); // old objects are also extended.
    otherValidator.attach('field', 'falsy');
    t.false(otherValidator.validate('field', 1));
    t.true(otherValidator.validate('field', 0));
});


test('it throws an exception when extending with an invalid validator', t => {
    // Static Extend.
    // No msg nor a validate method.
    t.throws(() => {
        Validator.extend('fail', {});
    });
    // No validate method.
    t.throws(() => {
        Validator.extend('fail', { msg: name => name });
    });
    // No msg method.
    t.throws(() => {
        Validator.extend('fail', { validate: () => true });
    });
    // numeric is already registered.
    t.throws(() => {
        Validator.extend('numeric', { msg: name => name, validate: () => true });
    });

    // instance Extend.
    // No msg nor a validate method.
    t.throws(() => {
        validator.extend('fail', {});
    });
    // No validate method.
    t.throws(() => {
        validator.extend('fail', { msg: name => name });
    });
    // No msg method.
    t.throws(() => {
        validator.extend('fail', { validate: () => true });
    });
    // numeric is already registered.
    t.throws(() => {
        validator.extend('numeric', { msg: name => name, validate: () => true });
    });
});
