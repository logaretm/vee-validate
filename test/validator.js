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

test('it can extend the validator with a validator function', t => {
    validator.extend('neg', (value) => Number(value) < 0);
    validator.attach('anotherField', 'neg');
    t.true(validator.validate('anotherField', -1));
    t.false(validator.validate('anotherField', 1));
    // default message check.
    t.is(validator.errorBag.first('anotherField'), 'The anotherField value is not valid.');
});

test('it can extend the validators for a validator instance', t => {
    const truthy = {
        getMessage: (field) => `The ${field} value is not truthy.`,
        validate: (value) => !! value
    };

    const falsy = {
        messages: {
            en: (field) => `The ${field} value is not falsy.`
        },
        validate: (value) => ! value
    };
    validator.extend('truthy', truthy); // instance extend.

    validator.attach('anotherField', 'truthy');
    t.true(validator.validate('anotherField', 1));
    t.false(validator.validate('anotherField', 0));
    t.is(validator.errorBag.first('anotherField'), 'The anotherField value is not truthy.');

    Validator.extend('falsy', falsy); // static extend.

    validator.attach('field', 'falsy');
    t.true(validator.validate('field', 0));
    t.false(validator.validate('field', 1));
    t.is(validator.errorBag.first('field'), 'The field value is not falsy.');
});


test('it throws an exception when extending with an invalid validator', t => {
    // Static Extend.
    // No getMessage nor a validate method.
    t.throws(() => {
        Validator.extend('fail', {});
    });
    // No validate method.
    t.throws(() => {
        Validator.extend('fail', { getMessage: name => name });
    });
    // No getMessage method.
    t.throws(() => {
        Validator.extend('fail', { validate: () => true });
    });
    // numeric is already registered.
    t.throws(() => {
        Validator.extend('numeric', { getMessage: name => name, validate: () => true });
    });

    // instance Extend.
    // No getMessage nor a validate method.
    t.throws(() => {
        validator.extend('fail', {});
    });
    // No validate method.
    t.throws(() => {
        validator.extend('fail', { getMessage: name => name });
    });
    // No getMessage method.
    t.throws(() => {
        validator.extend('fail', { validate: () => true });
    });
    // numeric is already registered.
    t.throws(() => {
        validator.extend('numeric', { getMessage: name => name, validate: () => true });
    });
});

test('it can change locales', t => {
    const arabicValidator = new Validator({ first_name: 'alpha' });
    arabicValidator.setLocale('ar');
    arabicValidator.attach('first_name', 'alpha');
    arabicValidator.validate('first_name', '0123');
    t.is(arabicValidator.errorBag.first('first_name'), 'first_name يجب ان يحتوي على حروف فقط.');
});


test('it defaults to english messages if no current locale counterpart is found', t => {
    const arabicValidator = new Validator({ first_name: 'alpha' });
    arabicValidator.setLocale('blabla');
    arabicValidator.attach('first_name', 'alpha');
    arabicValidator.validate('first_name', '0123');
    t.is(
        arabicValidator.errorBag.first('first_name'),
        'The first_name may only contain alphabetic characters and spaces.'
    );
});
