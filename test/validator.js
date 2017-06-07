import test from 'ava';
import Validator from './../src/validator';
import helpers from './helpers';
import ValidatorException from './../src/exceptions/validatorException';

// Converts the value to a boolean and returns it in a promise.
Validator.extend('promised', (value) => {
    return new Promise(resolve => {
        resolve({
            valid: !! value
        });
    });
});

test.beforeEach(() => {
    Validator.setLocale('en');
    Validator.updateDictionary({ ar: undefined }); // reset the dictionary for other tests.
    Validator.setStrictMode(true);
});

// All tests are serial because the locale is shared across all validators
// Which will result in a conflicting test cases.

test('empty values pass validation unless they are required', async t => {
    const v = new Validator({
        email: 'email',
        name: 'min:3',
        title: 'min:3',
        content: 'required|max:10',
    });

    t.true(await v.validate('email', ''));
    t.true(await v.validate('name', null));
    t.true(await v.validate('title', undefined));
    t.true(await v.validate('content', 'works'));

    t.false(await v.validate('content', ''));
    t.false(await v.validate('email', 'loga'));
    t.false(await v.validate('name', 'no'));
    t.false(await v.validate('title', 'no'));

});

test('can validate single values', async t => {
    let v = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });

    t.true(await v.validate('title', 'abc'));
    t.false(await v.validate('title', 'ab'));
    t.false(await v.validate('title', ''));
    t.false(await v.validate('title', 'a'.repeat(256)));

    v = new Validator();
    v.attach('el', 'required|min:3', { scope: 'scope' });
    t.false(await v.validate('scope.el', '12'));
    t.true(await v.validate('scope.el', '123'));
});

test('validates correctly regardless of rule placement', async t => {
    const v = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });

    t.true(await v.validate('title', 'Winter is coming'));
    t.false(await v.validate('title', 'No'));
    t.false(await v.validate('content', 'Winter is coming says everyone in the north'));
});

test('can be initialized with static create method', t => {
    const validator = Validator.create();
    t.true(validator instanceof Validator);
});

test('can be initialized without validations', t => {
    const validator = new Validator();
    t.true(validator instanceof Validator);
});

test('can add scopes', t => {
    const v = new Validator();

    t.falsy(v.$scopes.myscope);
    v.addScope('myscope');
    t.truthy(v.$scopes.myscope);
    t.falsy(v.$scopes.myscope.field);
    v.attach('field', 'required', { scope: 'myscope' });
    t.truthy(v.$scopes.myscope.field);
    v.addScope('myscope'); // doesn't overwrite if it exists.
    t.truthy(v.$scopes.myscope.field);

    // scopes can be numbers
    v.addScope(1);
    t.truthy(v.$scopes[1]);
});

test('can allow rules object', async t => {
    const v = new Validator();
    v.attach('field', {
        required: true, // test boolean.
        regex: /.(js|ts)$/, // test single value.
        min: 5, // test single value.
        in: ['blabla.js', 'blabla.ts'] // test params
    });

    t.false(await v.validate('field', ''));
    t.false(await v.validate('field', 'blabla'));
    t.false(await v.validate('field', 'g.js'));
    t.false(await v.validate('field', 'else.js'));
    t.true(await v.validate('field', 'blabla.js'));
    t.true(await v.validate('field', 'blabla.ts'));
});

test('validates multiple values', async t => {
    const v = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });

    t.true(await v.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'Winter is coming',
        content: 'John knows nothing',
        tags: 1
    }));
    t.deepEqual(v.errorBag.all(), []);
});

test('fails validation on a one-of-many failure', async t => {
    const v = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });
    t.false(await v.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'No',
        content: 'John knows nothing',
        tags: 1
    }));
});

test('bypasses values without rules in strictMode = off', async t => {
	Validator.setStrictMode(false)
	const v = new Validator({
		imp: 'required'
	});
    const result = await v.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });

    t.true(result);
    t.deepEqual(v.errorBag.all(), []);
    Validator.setStrictMode(true); // reset strictMode for remaining tests.
});

test('can set strict mode on specific instances', async t => {
	const v = new Validator({
		imp: 'required'
	});
    
    try {
        let result = await v.validateAll({
            imp: 'Tyrion Lannister',
            headless: 'Ned Stark'
        });
    } catch (error) {
        t.is(error.message, `[vee-validate]: Validating a non-existant field: "headless". Use "attach()" first.`);
    }

    v.setStrictMode(false);
    let result = await v.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });

    t.true(result); // strict = false.

    try {
        await (new Validator({ imp: 'required' }).validateAll({
            imp: 'Tyrion Lannister',
            headless: 'Ned Stark'
        })); // strict = true because this is a different instance.
    } catch (error) {
        t.is(error.message, `[vee-validate]: Validating a non-existant field: "headless". Use "attach()" first.`);
    }
});

test('formats error messages', async t => {
    const v = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });
    t.false(await v.validateAll({
        email: 'foo@bar.c',
        name: '',
        title: 'Wi',
        content: 'John knows nothing about this validator',
        tags: 4
    }));

    t.deepEqual(v.errorBag.all(), [
        'The email field must be a valid email.',
        'The name field is required.',
        'The title field must be at least 3 characters.',
        'The content field may not be greater than 20 characters.',
        'The tags field must be a valid value.'
    ]);
    t.deepEqual(v.getErrors().all(), [
        'The email field must be a valid email.',
        'The name field is required.',
        'The title field must be at least 3 characters.',
        'The content field may not be greater than 20 characters.',
        'The tags field must be a valid value.'
    ]);
});
test('can attach new fields', async t => {
    const v = new Validator();

    t.falsy(v.$scopes.__global__.field);
    v.attach('field', 'required|min:5');
    t.truthy(v.$scopes.__global__.field);
    t.false(await v.validate('field', 'less'));
    t.true(await v.validate('field', 'not less'));
});

test('can attach new fields and display errors with custom names', async t => {
    const v = new Validator();
    v.attach('field', 'min:5', { prettyName: 'pretty' });
    await v.validate('field', 'wo');
    t.is(v.getErrors().first('field'), 'The pretty field must be at least 5 characters.');
});

test('attaching new rules to an existing field should overwrite the old rules', async t => {
    const v = new Validator();
    v.attach('someField', 'required|min:3');
    t.false(await v.validate('someField', 'wo'));

    // does it overwrite the old rule?
    v.attach('someField', 'min:1|max:3');
    t.is(v.errorBag.collect('someField').length, 0); // are field errors cleared?
    t.true(await v.validate('someField', 'wo'));

    t.false(await v.validate('someField', 'woww'));
});

test('can append new validations to a field', async t => {
    const validator = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });

    validator.attach('field', 'min:2', { prettyName: 'pretty' });
    validator.append('field', 'max:3', { prettyName: 'pretty' });
    t.true(await validator.validate('field', 'wo'));
    t.true(await validator.validate('field', 'wow'));
    
    t.false(await validator.validate('field', 'woww'));
    t.false(await validator.validate('field', 'w'));

    // attaches if the field doesn't exist.
    const v = new Validator();

    v.attach('field', 'min:2');
    v.detach('field');
    v.append('field', 'min:3');
    
    t.false(await v.validate('field', 'wo'));
    t.true(await v.validate('field', 'wow'));
});

test('fails when trying to validate a non-existant field when strict mode is true.', async t => {
    const v = new Validator({
        email: 'required|email',
        name: 'required|min:3',
        title: 'required|min:3|max:255',
        content: 'required|max:20',
        tags: 'required|in:1,2,3,5'
    });
    
    t.throws(() => v.validate('nonExistant', 'whatever'));
});

test('can detach rules', t => {
    const v = new Validator();

    v.attach('field', 'required');
    t.truthy(v.$scopes.__global__.field);
    v.detach('field');
    t.falsy(v.$scopes.__global__.field);
    // Silently fails if the field does not exist.
    t.notThrows(() => {
        v.detach('someOtherField');
    });
});

test('can validate specific scopes', async t => {
    const v = new Validator();

    v.attach('field', 'alpha', { getter: () => '123', context: () => 'context' });
    v.attach('field', 'alpha', { scope: 'myscope', getter: () => '123', context: () => 'context' });
    v.attach('field', 'alpha', { scope: 'otherscope', getter: () => '123', context: () => 'context' });

    // only '__global__' scope got validated.
    t.false(await v.validateAll());
    t.is(v.errorBag.count(), 1);

    // the second scope too.
    t.false(await v.validateAll('myscope'));
    t.is(v.errorBag.count(), 2);


    v.errorBag.clear();
    t.false(await v.validateScopes());
    t.is(v.errorBag.count(), 3);
});

test('can validate specific scopes on an object', async t => {
    const v = new Validator({
        'field': 'required'
    });

    v.attach('field', 'required', { scope: 'myscope' })
    v.attach('anotherfield', 'required', { scope: 'myscope' })

    // only '__global__' scope got validated.
    t.false(await v.validateAll({ field: null }));
    t.is(v.errorBag.count(), 1);

    // this time only 'myscope' got validated.
    v.errorBag.clear();
    t.false(await v.validateAll({ field: null, anotherfield: null }, 'myscope'));
    t.is(v.errorBag.count(), 2);
})

test('can find errors by field and rule', async t => {
    const v = new Validator({ name: 'alpha' });
    t.false(await v.validate('name', 12));
    t.truthy(v.errorBag.first('name:alpha'));
    t.falsy(v.errorBag.first('name:required'));
});

test('can extend the validator with a validator function', async t => {
    const v = new Validator();
    v.extend('neg', (value) => Number(value) < 0);
    v.attach('anotherField', 'neg');
    t.true(await v.validate('anotherField', -1));
    t.false(await v.validate('anotherField', 1));
    t.is(v.errorBag.first('anotherField'), 'The anotherField value is not valid.');
});

test('can extend the validators for a validator instance', async t => {
    const truthy = {
        getMessage: (field) => `The ${field} field value is not truthy.`,
        validate: (value) => !! value
    };

    Validator.extend('truthy', truthy); // static extend.
    const v = new Validator();
    v.attach('anotherField', 'truthy');
    t.true(await v.validate('anotherField', 1));
    t.false(await v.validate('anotherField', 0));
    t.is(v.errorBag.first('anotherField'), 'The anotherField field value is not truthy.');
});

test.serial('can add a custom validator with localized messages', async t => {
    const falsy = {
        messages: {
            en: (field) => `The ${field} field value is not falsy.`,
            ar: () => 'Some Arabic Text'
        },
        validate: (value) => ! value
    };

    Validator.extend('falsy', falsy);
    const v = new Validator();
    v.attach('anotherField', 'falsy');
    t.false(await v.validate('anotherField', 1));
    t.is(v.errorBag.first('anotherField'), 'The anotherField field value is not falsy.');

    v.setLocale('ar');
    t.is(v.locale, 'ar');
    
    t.false(await v.validate('anotherField', 1));
    t.is(v.errorBag.first('anotherField'), 'Some Arabic Text');
});

test.serial('can set the locale statically', async t => {
    Validator.updateDictionary({
        ar: {
            messages: {
                alpha: () => 'البتاعة لازم يكون حروف بس'
            }
        }
    });
    Validator.setLocale('ar');
    const loc = new Validator();
    loc.attach('name', 'alpha');
    await loc.validate('name', '1234', '__global__');
    t.is(loc.locale, 'ar');
    t.is(loc.getErrors().first('name'), 'البتاعة لازم يكون حروف بس');
});

test('throws an exception when extending with an invalid validator', t => {
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
    t.notThrows(() => {
        Validator.extend('numeric', { getMessage: name => name, validate: () => true });
    });
});

test.serial('defaults to english messages if no current locale counterpart is found', async t => {
    const loc = new Validator({ first_name: 'alpha' });
    loc.setLocale('fr');
    loc.attach('first_name', 'alpha');
    await loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'The first_name field may only contain alphabetic characters.');
});

test.serial('can overwrite messages and add translated messages', async t => {
    const loc = new Validator({ first_name: 'alpha' });
    Validator.updateDictionary({
        ar: { messages: { alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.`} },
        en: { messages: { alpha: (field) => `${field} is alphabetic.` } }
    });
    loc.attach('first_name', 'alpha');
    await loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'first_name is alphabetic.');

    loc.setLocale('ar');
    await loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'first_name يجب ان يحتوي على حروف فقط.');

    loc.updateDictionary({
        ar: { messages: { alpha: () => 'My name is jeff' } }
    });
    await loc.validate('first_name', '0123');
    t.is(loc.errorBag.first('first_name'), 'My name is jeff');
});

test.serial('sets locale for all validators', async t => {
    const v1 = new Validator({ first_name: 'alpha' });
    const v2 = new Validator({ first_name: 'alpha' });
    Validator.updateDictionary({
        ar: { messages: { alpha: () => 'عايز حروف'} },
        en: { messages: { alpha: () => 'is alphabetic' } }
    });

    v1.setLocale('ar');
    await v1.validate('first_name', '213');
    t.is(v1.errorBag.first('first_name'), 'عايز حروف');

    await v2.validate('first_name', '213');
    t.is(v2.errorBag.first('first_name'), 'عايز حروف');

    // doesn't matter which instance sets the locale.
    v2.setLocale('en');
    await v1.validate('first_name', '213');
    t.is(v1.errorBag.first('first_name'), 'is alphabetic');
    await v2.validate('first_name', '213');
    t.is(v2.errorBag.first('first_name'), 'is alphabetic');
});

test('resolves promises to booleans', async t => {
    const params = [150, 100];
    const v = new Validator({
        image: 'dimensions:150,100'
    });

    helpers.dimensionsTest({ width: 150, height: 100 }, false, global);
    t.true(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)]));

    helpers.dimensionsTest({ width: 150, height: 100}, true, global);
    t.false(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)]));

    helpers.dimensionsTest({ width: 30, height: 20}, false, global);
    t.false(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)]));
    
});

test('wont install moment if the provided reference is not provided or not a function', t => {
    t.false(Validator.installDateTimeValidators());
    t.false(Validator.installDateTimeValidators('But I am moment!')); // nope
});

test('installs date validators', async t => {
    const moment = require('moment');
    t.true(Validator.installDateTimeValidators(moment));
    const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

    helpers.querySelector({ name: 'field', value: '02/01/2008' });
    t.true(await v.validate('birthday', '01/12/2008'));

    t.false(await v.validate('birthday', '01/01/2008'));
});

test('appends date_format to validator using dynamic rule', async t => {
    const moment = require('moment');
    t.true(Validator.installDateTimeValidators(moment));
    const v = new Validator({ birthday: {
        date_format:'DD/MM/YYYY',
        date_between: [ '01/10/2007', '03/12/2008']
    } });

    let rules = v._normalizeObject({
        date_format:'DD/MM/YYYY',
        date_between: [ '01/10/2007', '03/12/2008']
    });

    t.true(rules.date_between.length === 3);

    rules = v._normalizeObject(rules);
    t.true(rules.date_between.length === 3);
});

test('correctly parses rules with multiple colons', async t => {
    const v = new Validator({ time: 'date_format:HH:mm' });
    t.true(await v.validate('time', '15:30'));
    t.false(await v.validate('time', '1700'));
});

test('auto installs date validators if moment is present globally', async t => {
    global.moment = require('moment');
    const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

    helpers.querySelector({ name: 'field', value: '02/01/2008' });
    t.true(await v.validate('birthday', '01/12/2008'));
    t.false(await v.validate('birthday', '01/01/2008'));
});

test('can add custom names via the attributes dictionary', async t => {
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

    t.false(await v.validate('email', 'notvalidemail'));
    t.is(v.getErrors().first('email'), 'The Email Address field must be a valid email.');
});

test('cascades promise values with previous boolean', async t => {
    const v = new Validator({ email: 'required|promised|email' });
    const result = v.validate('email', 'someemail@email.com');
    t.true(typeof result.then === 'function');
    t.false(await v.validate('email', 'invalid'));
});

test('cascades promise values with previous fields', async t => {
    const v = new Validator({
        email: 'required|promised|email',
        name: 'alpha|promised',
        phone: 'promised|numeric'
    });
    let result = await v.validateAll({
        email: 'somemeail@yahoo.com',
        name: 'ProperName',
        phone: '11123112123'
    });
    t.true(result); // should pass

    t.false(await v.validateAll({
        email: 'somemeail', // not valid email.
        name: 'ProperName',
        phone: '11123112123'
    }));
});

test('can translate target field for field dependent validations', async t => {
    const v = new Validator({
        birthday: 'date_format:DD-MM-YYYY|after:birthday_min'
    });

    v.updateDictionary({
        en: {
            attributes: {
                birthday: 'Birthday',
                birthday_min: 'Some Date'
            }
        }
    });

    helpers.querySelector({ name: 'birthday_min', value: '12-09-2017' });
    await v.validate('birthday', '11-09-2017');
    t.is(v.errorBag.first('birthday'), 'The Birthday must be after Some Date.');
});


test('auto detect confirmation field when none given', async t => {
    const v = new Validator({
        password: 'confirmed'
    });

    helpers.querySelector({ name: 'password_confirmation', value: 'secret' });
    t.true(await v.validate('password', 'secret'));
    t.false(await v.validate('password', 'fail'));
    t.is(v.errorBag.first('password'), 'The password confirmation does not match.');
});

test('without promises', async t => {
    const v = new Validator();
    v.extend('reason', {
        getMessage(field, params, data) {
            return data;
        },
        validate(value, params) {
            return {
                valid: false,
                data: 'Not correct'
            }
        }
    });

    v.attach('field', 'reason');
    
        t.false(await v.validate('field', 'wow'));


    t.is(v.errorBag.first('field'), 'Not correct');
});

test('using promises', async t => {
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
    
        t.false(await v.validate('reason_field', 'trigger'));

    t.is(v.errorBag.first('reason_field'), 'Not this value');
    
        t.false(await v.validate('reason_field', false));

    t.is(v.errorBag.first('reason_field'), 'Something went wrong');
});

test('can remove rules from the list of validators', async t => {
    Validator.extend('dummy', (value) => !! value);
    const v1 = new Validator({ name: 'dummy'});
    
        await v1.validate('name', false);

    v1.remove('dummy');
    t.throws(() => {
        v1.validate('name', false)
    });
});

test('can fetch the values using getters when not specifying values in validateAll', async t => {
    const v = new Validator();
    const getter = (context) => {
        return context.value
    };
    let toggle = false;
    const context = t => {
        toggle = ! toggle;
        return { value: toggle ? 'valid' : '123' }
    };

    // must use the attach API.
    v.attach('name', 'required|alpha', { prettyName: 'Full Name', context, getter });

    t.true(await v.validateAll());
    t.true(toggle);
    t.false(await v.validateAll());
});

test('can fetch the values using getters for a specific scope when not specifying values in validateAll', async t => {
    const v1 = new Validator();
    const contexts = [
        () => ({ value: 'martin' }),
        () => ({ value: 'invalid value' })
    ];
    const getter = (c) => c.value;

    // must use the attach API.
    v1.attach('name', 'required|alpha', { scope: () => 'scope1', context: contexts[0], getter });
    v1.attach('name_two', 'required|alpha', { scope: () => 'scope2', context: contexts[1], getter });

    t.true(await v1.validateAll('scope1'));
    t.false(await v1.validateAll('scope2'));    
});

test('ignores empty rules', async t => {
    // contains two empty rules, one with params.
    const v1 = new Validator({ name: 'required|alpha||:blabla' });
    t.false(await v1.validate('name', 12));
    t.true(await v1.validate('name', 'Martin'));
});

test('can update validations of a field', async t => {
    const v = new Validator({
        name: 'required|alpha'
    });
    t.false(await v.validate('name', 12));
    v.updateField('name', 'required|numeric', { scope: '__global__' });
    t.is(v.errorBag.count(), 0);
    t.true(await v.validate('name', 12));
});

test('handles dot notation names', async t => {
    const v = new Validator();
    v.attach('example.name', 'required|alpha');
    t.false(await v.validate('example.name', ''));
    t.true(await v.validate('example.name', 'ad'));
});

test('sets aria attributes on elements', async t => {
    const v = new Validator();
    let el = document.createElement('input');
    v.attach('name', 'required', {
        listeners: { el }
    });
    t.is(el.getAttribute('aria-required'), 'true');
    el = document.createElement('input');
    v.attach('valid', 'alpha', {
        listeners: { el }
    });
    t.is(el.getAttribute('aria-required'), 'false');
    t.is(el.getAttribute('aria-invalid'), 'false');
    t.false(await v.validate('valid', '123'));
    t.is(el.getAttribute('aria-invalid'), 'true');

    await v.validate('valid', 'abc');
    t.is(el.getAttribute('aria-invalid'), 'false');
});

test('it can add events via on', t => {
    const v = new Validator();
    v.attach('name', 'required', {
        scope: 'scope'
    });
    v.on('after', 'name', 'scope', () => {});
    t.true(typeof v.$scopes['scope'].name.events.after === 'function');
    v.attach('dotted.name', 'required');
    v.on('after', 'dotted.name', '__global__', () => {});
    t.true(typeof v.$scopes.__global__['dotted.name'].events.after === 'function');
});

test('it can remove events via off', t => {
    const v = new Validator();
    v.attach('name', 'required', {
        scope: 'scope'
    });
    v.on('after', 'name', 'scope', () => {});
    v.off('after', 'name', 'scope');
    t.true(typeof v.$scopes['scope'].name.events.after === 'undefined');
    v.attach('dotted.name', 'required');
    v.on('after', 'dotted.name', '__global__', () => {});
    v.off('after', 'dotted.name', '__global__');
    t.true(typeof v.$scopes.__global__['dotted.name'].events.after === 'undefined');
});

test('validations can be paused and resumed', async t => {
    const v = new Validator();
    v.attach('name', 'required');

    v.pause();

    t.true(await v.validate('name', ''));
    t.true(await v.validateAll());
    t.true(await v.validateScopes());
    
    v.resume();
    t.false(await v.validate('name', ''));

    t.false(await v.validateAll({
        name: ''
    }));
});

test('it can hold multiple errors for one field', async t => {
    const v = new Validator({
        name: 'alpha|min:3'
    }, { fastExit: false });
    t.false(await v.validate('name', '2'));
    t.is(v.errorBag.count(), 2);
});