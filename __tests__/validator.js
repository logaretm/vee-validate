import Validator from './../src/validator';
import helpers from './helpers';

// Converts the value to a boolean and returns it in a promise.
Validator.extend('promised', (value) => {
    return new Promise(resolve => {
        resolve({
            valid: !! value
        });
    });
});

const validator = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
});

it('ty values pass validation unless they are required', () => {
    const v = new Validator({
        email: 'email',
        name: 'min:3',
        title: 'min:3',
        content: 'required|max:10',
    });

    expect(v.validate('email', '')).toBe(true);
    expect(v.validate('name', null)).toBe(true);
    expect(v.validate('title', undefined)).toBe(true);
    expect(v.validate('content', 'works')).toBe(true);

    expect(v.validate('content', '')).toBe(false);
    expect(v.validate('email', 'loga')).toBe(false);
    expect(v.validate('name', 'no')).toBe(false);
    expect(v.validate('title', 'no')).toBe(false);
});

it('can validate single values', () => {
    expect(validator.validate('title', 'abc')).toBe(true);
    expect(validator.validate('title', 'ab')).toBe(false);
    expect(validator.validate('title', '')).toBe(false);
    expect(validator.validate('title', 'a'.repeat(256))).toBe(false);
});

it('validates correctly regardless of rule placement', () => {
    const result1 = validator.validate('title', 'Winter is coming');
    const result2 = validator.validate('title', 'No');
    const result3 = validator.validate('content', 'Winter is coming says everyone in the north');

    expect(result1).toBe(true);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
});

it('can be initialized with static create method', () => {
    const validator2 = Validator.create();
    expect(validator2).toBeInstanceOf(Validator);
});

it('can be initialized without validations', () => {
    const validator2 = new Validator();
    expect(validator2).toBeInstanceOf(Validator);
});

it('can allow array of rules for fields', () => {
    const v = new Validator();
    v.attach('file', [
        { name: 'required' },
        { name: 'regex', params: [/.(js|ts)$/] }
    ]);

    expect(v.validate('file', 'blabla.js')).toBe(true);
    expect(v.validate('file', 'blabla.ts')).toBe(true);
    expect(v.validate('file', 'blabla.css')).toBe(false);
});

it('validates multiple values', () => {
    const result = validator.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'Winter is coming',
        content: 'John knows nothing',
        tags: 1
    });

    expect(result).toBe(true);
    expect(validator.errorBag.all()).toEqual([]);
});

it('fails validation on a one-of-many failure', () => {
    const result = validator.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'No',
        content: 'John knows nothing',
        tags: 1
    });

    expect(result).toBe(false);
    expect(validator.errorBag.all()).toContain("The title must be at least 3 characters.");
});

it('bypasses values without rules in strictMode = off', () => {
	Validator.setStrictMode(false)
	const validator3 = new Validator({
		imp: 'required'
	});
    const result = validator3.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });

    expect(result).toBe(true);
    expect(validator3.errorBag.all()).toEqual([]);
    Validator.setStrictMode(true) // reset strictMode for remaining tests.
});

it('can set strict mode on specific instances', () => {
	const validator3 = new Validator({
		imp: 'required'
	});
    let result = validator3.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });
    expect(result).toBe(false); // strict = true.
    validator3.setStrictMode(false);
    result = validator3.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });

    expect(result).toBe(true); // strict = false.

    result = new Validator({ imp: 'required' }).validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });
    expect(result).toBe(false); // strict = true because this is a different instance.
});

it('formats error messages', () => {
    const result = validator.validateAll({
        email: 'foo@bar.c',
        name: '',
        title: 'Wi',
        content: 'John knows nothing about this validator',
        tags: 4
    });

    expect(result).toBe(false);
    expect(validator.errorBag.all()).toEqual([
        'The email must be a valid email.',
        'The name is required.',
        'The name must be at least 3 characters.',
        'The title must be at least 3 characters.',
        'The content may not be greater than 20 characters.',
        'The tags must be a valid value.'
    ]);
    expect(validator.getErrors().all()).toEqual([
        'The email must be a valid email.',
        'The name is required.',
        'The name must be at least 3 characters.',
        'The title must be at least 3 characters.',
        'The content may not be greater than 20 characters.',
        'The tags must be a valid value.'
    ]);

});
it('can attach new fields', () => {
    validator.attach('field', 'required|min:5');
    expect(validator.validate('field', 'less')).toBe(false);
    expect(validator.validate('field', 'not less')).toBe(true);
});

it('can attach new fields and display errors with custom names', () => {
    validator.attach('field', 'min:5', 'pretty field');
    validator.validate('field', 'wo');
    expect(validator.getErrors().first('field')).toBe('The pretty field must be at least 5 characters.');
});

it('attaching new rules to an existing field should overwrite the old rules', () => {
    validator.attach('someField', 'required|min:3');
    expect(validator.validate('someField', 'wo')).toBe(false); // add error.
    expect(validator.errorBag.collect('someField').length).toBe(1);

    // does it overwrite the old rule?
    validator.attach('someField', 'min:1|max:3');
    expect(validator.errorBag.collect('someField').length).toBe(0); // are field errors rest?
    expect(validator.validate('someField', 'wo')).toBe(true); // was the old min validator overwritten?
    expect(validator.validate('someField', 'woww')).toBe(false); // did the max validator work?
});

it('returns false when trying to validate a non-existant field.', () => {
    expect(validator.validate('nonExistant', 'whatever')).toBe(false);
});

it('can detach rules', () => {
    validator.detach('field');
    expect(validator.$fields.field).toBeFalsy();
});

it('can extend the validator with a validator function', () => {
    validator.extend('neg', (value) => Number(value) < 0);
    validator.attach('anotherField', 'neg');
    expect(validator.validate('anotherField', -1)).toBe(true);
    expect(validator.validate('anotherField', 1)).toBe(false);
    // default message check.
    expect(validator.errorBag.first('anotherField')).toBe('The anotherField value is not valid.');
});

it('can extend the validators for a validator instance', () => {
    const truthy = {
        getMessage: (field) => `The ${field} value is not truthy.`,
        validate: (value) => !! value
    };

    Validator.extend('truthy', truthy); // static extend.
    validator.attach('anotherField', 'truthy');
    expect(validator.validate('anotherField', 1)).toBe(true);
    expect(validator.validate('anotherField', 0)).toBe(false);
    expect(validator.errorBag.first('anotherField')).toBe('The anotherField value is not truthy.');
});

it('can add a custom validator with localized messages', () => {
    const falsy = {
        messages: {
            en: (field) => `The ${field} value is not falsy.`,
            ar: () => 'Some Arabic Text'
        },
        validate: (value) => ! value
    };

    Validator.extend('falsy', falsy);
    validator.attach('anotherField', 'falsy');
    expect(validator.validate('anotherField', 1)).toBe(false);
    expect(validator.errorBag.first('anotherField')).toBe('The anotherField value is not falsy.');
    validator.setLocale('ar');
    expect(validator.validate('anotherField', 1)).toBe(false);
    expect(validator.errorBag.first('anotherField')).toBe('Some Arabic Text');
});

it('can set the default locale for newly created validators', () => {
    Validator.updateDictionary({ ar: {
        messages: {
            alpha: () => 'البتاعة لازم يكون حروف بس'
        }
    }});
    Validator.setDefaultLocale('ar');
    const loc = new Validator({ name: 'alpha' });

    expect(loc.validate('name', '1234')).toBe(false);
    expect(loc.locale).toBe('ar');
    expect(loc.getErrors().first('name')).toBe('البتاعة لازم يكون حروف بس');

    Validator.setDefaultLocale(); // resets to english.
    Validator.updateDictionary({ ar: { messages: { alpha: '' } }}); // reset the dictionary for other tests.
});

it('throws an exception when extending with an invalid validator', () => {
    // Static Extend.
    // No getMessage nor a validate method.
    expect(() => {
        Validator.extend('fail', {});
    }).toThrow();
    // No validate method.
    expect(() => {
        Validator.extend('fail', { getMessage: name => name });
    }).toThrow();
    // No getMessage method.
    expect(() => {
        Validator.extend('fail', { validate: () => true });
    }).toThrow();
    // numeric is already registered.
    expect(() => {
        Validator.extend('numeric', { getMessage: name => name, validate: () => true });
    }).toThrow();
});

it('defaults to english messages if no current locale counterpart is found', () => {
    const loc = new Validator({ first_name: 'alpha' });
    loc.setLocale('ar');
    loc.attach('first_name', 'alpha');
    loc.validate('first_name', '0123');

    expect(loc.errorBag.first('first_name')).toBe('The first_name may only contain alphabetic characters.');
});

it('can overwrite messages and add translated messages', () => {
    const loc = new Validator({ first_name: 'alpha' });
    Validator.updateDictionary({
        ar: { messages: { alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.`} },
        en: { messages: { alpha: (field) => `${field} is alphabetic.` } }
    });
    loc.attach('first_name', 'alpha');
    loc.validate('first_name', '0123');

    expect(loc.errorBag.first('first_name')).toBe('first_name is alphabetic.');

    loc.setLocale('ar');
    loc.validate('first_name', '0123');

    expect(loc.errorBag.first('first_name')).toBe('first_name يجب ان يحتوي على حروف فقط.');

    loc.updateDictionary({
        ar: { messages: { alpha: () => 'My name is jeff' } }
    });
    loc.validate('first_name', '0123');

    expect(loc.errorBag.first('first_name')).toBe('My name is jeff');
});

it('ing line 30', () => {
    const chineseValidator = new Validator({ first_name: 'alpha' });
    chineseValidator.updateDictionary({
        cn: { messages: { alpha: () => 'My name is jeff' } }
    });
    chineseValidator.setLocale('cn');
    chineseValidator.validate('first_name', '0123');

    expect(chineseValidator.errorBag.first('first_name')).toBe('My name is jeff');
});

it('resolves promises to booleans', async () => {
    const params = [150, 100];
    const v = new Validator({
        image: 'dimensions:150,100'
    });

    helpers.dimensionsTest({ width: 150, height: 100 });

    let value = await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)], params);
    expect(value).toBe(true);

    helpers.dimensionsTest({ width: 150, height: 100}, true);
    value = await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)], params);
    expect(value).toBe(false);

    value = await v.validate('image', [helpers.file('file.pdf', 'application/pdf', 10)], params);
    expect(value).toBe(false);

    helpers.dimensionsTest({ width: 30, height: 20});
    value = await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)], params);
    expect(value).toBe(false);
});

it('wont install moment if the provided reference is not provided or not a function', () => {
    expect(Validator.installDateTimeValidators()).toBe(false);
    expect(Validator.installDateTimeValidators('But I am moment!')).toBe(false); // nope
});

it('installs date validators', () => {
    const moment = require('moment');
    expect(Validator.installDateTimeValidators(moment)).toBe(true);
    const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

    helpers.querySelector({ name: 'field', value: '02/01/2008' });
    expect(v.validate('birthday', '01/12/2008')).toBe(true);
    expect(v.validate('birthday', '01/01/2008')).toBe(false);
});

it('auto installs date validators if moment is present globally', () => {
    global.moment = require('moment');
    const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

    helpers.querySelector({ name: 'field', value: '02/01/2008' });
    expect(v.validate('birthday', '01/12/2008')).toBe(true);
    expect(v.validate('birthday', '01/01/2008')).toBe(false);
});

it('can add custom names via the attributes dictionary', () => {
    const v = new Validator({
        email: 'required|email'
    });

    v.updateDictionary({
        en: {
            attributes: {
                email: 'Email Address'
            }
        }
    });

    expect(v.validate('email', 'notvalidemail')).toBe(false);
    expect(v.getErrors().first('email')).toBe('The Email Address must be a valid email.');
});

it('cascades promise values with previous boolean', () => {
    const v = new Validator({ email: 'required|promised|email' });
    const result = v.validate('email', 'someemail@email.com');
    expect(typeof result.then === 'function').toBe(true);

    result.then(value => {
        expect(result).toBe(true);
    });
    v.validate('email', 'invalid').then(value => {
        expect(value).toBe(false);
    });
});

it('cascades promise values with previous fields', () => {
    const v = new Validator({
        email: 'required|promised|email',
        name: 'alpha|promised',
        phone: 'promised|numeric'
    });
    let result = v.validateAll({
        email: 'somemeail@yahoo.com',
        name: 'ProperName',
        phone: '11123112123'
    });
    expect(typeof result.then === 'function').toBe(true); // is a promise
    result.then(value => {
        expect(value).toBe(true); // should pass
    });

    result = v.validateAll({
        email: 'somemeail', // not valid email.
        name: 'ProperName',
        phone: '11123112123'
    });
    result.then(value => {
        expect(value).toBe(false); // should fail
    });
});

it('can translate target field for field dependent validations', () => {
    const v = new Validator({
        email: 'email|confirmed:email_confirmation'
    });

    v.updateDictionary({
        en: {
            attributes: {
                email: 'Email Address',
                email_confirmation: 'Email Confirmation'
            }
        }
    });

    helpers.querySelector({ name: 'email_confirmation', value: 'someemail@gmail.com' });
    v.validate('email', 'someotheremail@gmail.com');
    expect(v.errorBag.first('email')).toBe('The Email Address does not match the Email Confirmation.');
});

it('validators can specify a reason for failing that will alter the error message', async () => {
    const v = new Validator();

    v.extend('reason_test', {
        getMessage(field, params, data) {
            return (data && data.message) || 'Something went wrong';
        },
        validate(value) {
            if (value === 'trigger') {
                return {
                    valid: false,
                    data: {
                        message: 'Not this value'
                    }
                }
            }

            return !! value;
        }
    });
    v.extend('reason_test_promise', {
        getMessage(field, params, data) {
            return (data && data.message) || 'Something went wrong';
        },
        validate(value) {
            return new Promise(resolve => {
                resolve({
                    valid: value === 'trigger' ? false : !! value,
                    data: value !== 'trigger' ? undefined : {
                        message: 'Not this value'
                    }
                });
            })
        }
    });
    v.attach('reason_field', 'reason_test');

    expect(await v.validate('reason_field', 'trigger')).toEqual(false);
    expect(v.errorBag.first('reason_field')).toBe('Not this value');
    expect(await v.validate('reason_field', false)).toBe(false);
    expect(v.errorBag.first('reason_field')).toBe('Something went wrong');
});
