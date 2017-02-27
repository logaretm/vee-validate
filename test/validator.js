import Validator from './../src/validator';
import helpers from './helpers';

afterEach(() => {
    Validator.setLocale();
});

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
validator.init();

it('empty values pass validation unless they are required', async () => {
    const v = new Validator({
        email: 'email',
        name: 'min:3',
        title: 'min:3',
        content: 'required|max:10',
    });

    expect(await v.validate('email', '')).toBe(true);
    expect(await v.validate('name', null)).toBe(true);
    expect(await v.validate('title', undefined)).toBe(true);
    expect(await v.validate('content', 'works')).toBe(true);

    try {
        await v.validate('content', '');
    } catch (error) {
        expect(error).toBe(false);
    }

    try {
        await v.validate('email', 'loga')
    } catch (error) {
        expect(error).toBe(false);           
    }

    try {
        await v.validate('name', 'no');
    } catch (error) {
        expect(error).toBe(false);          
    }
    try {
        await v.validate('title', 'no')
    } catch (error) {
        expect(error).toBe(false);   
    }
});

it('can validate single values', async () => {
    expect(await validator.validate('title', 'abc')).toBe(true);
    
    try {
        await validator.validate('title', 'ab');
    } catch (error) {
        expect(error).toBe(false);
    }
    try {
        await validator.validate('title', '');
    } catch (error) {
        expect(error).toBe(false);
    }
    try {
        await validator.validate('title', 'a'.repeat(256));
    } catch (error) {
        expect(error).toBe(false);
    }

    const v = new Validator();
    v.attach('el', 'required|min:3', { scope: 'scope' });
    try {
        await v.validate('scope.el', '12')
    } catch (error) {
        expect(error).toBe(false);
    }
    expect(await v.validate('scope.el', '123')).toBe(true);
});

it('validates correctly regardless of rule placement', async () => {
    expect(await validator.validate('title', 'Winter is coming')).toBe(true);
    try {
        await validator.validate('title', 'No');
    } catch (error) {
        expect(error).toBe(false);
    }
    try {
        await validator.validate('content', 'Winter is coming says everyone in the north');
    } catch (error) {
        expect(error).toBe(false);
    }
});

it('can be initialized with static create method', () => {
    const validator2 = Validator.create();
    expect(validator2).toBeInstanceOf(Validator);
});

it('can be initialized without validations', () => {
    const validator2 = new Validator();
    expect(validator2).toBeInstanceOf(Validator);
});

it('can add scopes', () => {
    const v = new Validator();
    
    expect(v.$scopes.myscope).toBeFalsy();
    v.addScope('myscope');
    expect(v.$scopes.myscope).toBeTruthy();
    expect(v.$scopes.myscope.field).toBeFalsy();
    v.attach('field', 'required', { scope: 'myscope' });
    expect(v.$scopes.myscope.field).toBeTruthy();
    v.addScope('myscope'); // doesn't overwrite if it exists.
    expect(v.$scopes.myscope.field).toBeTruthy();

    // scopes can be numbers
    v.addScope(1);
    expect(v.$scopes[1]).toBeTruthy();
});

it('can allow rules object', async () => {
    const v = new Validator();
    v.attach('field', {
        required: true, // test boolean.
        regex: /.(js|ts)$/, // test single value.
        min: 5, // test single value.
        in: ['blabla.js', 'blabla.ts'] // test params
    });
    

    try {
        await v.validate('field', '')
    } catch (err) {
        expect(err).toBe(false); // required.
    }
    try {
        await v.validate('field', 'blabla')
    } catch (err) {
        expect(err).toBe(false); // regex.
    }
    try {
        await v.validate('field', 'g.js')
    } catch (err) {
        expect(err).toBe(false); // min.
    }

    try {
        v.validate('field', 'else.js')
    } catch (err) {
        expect(err).toBe(false); // in.
    }

    expect(await v.validate('field', 'blabla.js')).toBe(true);
    expect(await v.validate('field', 'blabla.ts')).toBe(true);
});

it('validates multiple values', async () => {
    const result = await validator.validateAll({
        email: 'foo@bar.com',
        name: 'John Snow',
        title: 'Winter is coming',
        content: 'John knows nothing',
        tags: 1
    });

    expect(result).toBe(true);
    expect(validator.errorBag.all()).toEqual([]);
});

it('fails validation on a one-of-many failure', async () => {
    try {
        const result = await validator.validateAll({
            email: 'foo@bar.com',
            name: 'John Snow',
            title: 'No',
            content: 'John knows nothing',
            tags: 1
        });
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    }
});

it('bypasses values without rules in strictMode = off', async () => {
	Validator.setStrictMode(false)
	const validator3 = new Validator({
		imp: 'required'
	});
    const result = await validator3.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });

    expect(result).toBe(true);
    expect(validator3.errorBag.all()).toEqual([]);
    Validator.setStrictMode(true); // reset strictMode for remaining tests.
});

it('can set strict mode on specific instances', async () => {
	const validator3 = new Validator({
		imp: 'required'
	});
    try {
        let result = await validator3.validateAll({
            imp: 'Tyrion Lannister',
            headless: 'Ned Stark'
        });
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    }

    validator3.setStrictMode(false);
    let result = await validator3.validateAll({
    	imp: 'Tyrion Lannister',
        headless: 'Ned Stark'
    });

    expect(result).toBe(true); // strict = false.

    try {
        await (new Validator({ imp: 'required' }).validateAll({
            imp: 'Tyrion Lannister',
            headless: 'Ned Stark'
        })); // strict = true because this is a different instance.
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    }
});

it('formats error messages', async () => {
    try {
        const result = await validator.validateAll({
            email: 'foo@bar.c',
            name: '',
            title: 'Wi',
            content: 'John knows nothing about this validator',
            tags: 4
        });
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
        expect(validator.errorBag.all()).toEqual([
            'The email field must be a valid email.',
            'The name field is required.',
            'The title field must be at least 3 characters.',
            'The content field may not be greater than 20 characters.',
            'The tags field must be a valid value.'
        ]);
        expect(validator.getErrors().all()).toEqual([
            'The email field must be a valid email.',
            'The name field is required.',
            'The title field must be at least 3 characters.',
            'The content field may not be greater than 20 characters.',
            'The tags field must be a valid value.'
        ]);
    }
});
it('can attach new fields', async () => {
    const v = new Validator();
    
    expect(v.$scopes.__global__.field).toBeFalsy();
    v.attach('field', 'required|min:5');
    expect(v.$scopes.__global__.field).toBeTruthy();
    try {
        v.validate('field', 'less')
    } catch (error) {
        expect(error).toBe(false);    
    }
    
    expect(await v.validate('field', 'not less')).toBe(true);
});

it('can attach new fields and display errors with custom names', async () => {
    validator.attach('field', 'min:5', { prettyName: 'pretty' });
    try {
        await validator.validate('field', 'wo');
    } catch (error) {
        expect(validator.getErrors().first('field')).toBe('The pretty field must be at least 5 characters.');   
    }
});

it('attaching new rules to an existing field should overwrite the old rules', async () => {
    validator.attach('someField', 'required|min:3');
    try {
        await validator.validate('someField', 'wo');
    } catch (error) {
        expect(validator.errorBag.collect('someField').length).toBe(1);
    }

    // does it overwrite the old rule?
    validator.attach('someField', 'min:1|max:3');
    expect(validator.errorBag.collect('someField').length).toBe(0); // are field errors reset?
    try {
        await validator.validate('someField', 'wo');
    } catch (result) {
        expect(result).toBe(true)   
    }
    
    try {
        await validator.validate('someField', 'woww');
    } catch (result) {
        expect(result).toBe(false); // did the max validator work?
    }
});

it('can append new validations to a field', async () => {
    validator.attach('field', 'min:2', { prettyName: 'pretty' });
    validator.append('field', 'max:3', { prettyName: 'pretty' });
    expect(await validator.validate('field', 'wo')).toBe(true);
    expect(await validator.validate('field', 'wow')).toBe(true);
    try {
        await validator.validate('field', 'woww')
    } catch (error) {
        expect(error).toBe(false);
    }

    try {
        await validator.validate('field', 'w')
    } catch (error) {
        expect(error).toBe(false);
    }

    // attaches if the field doesn't exist.
    const v = new Validator();
    
    v.attach('field', 'min:2');
    v.detach('field');
    v.append('field', 'min:3');
    try {
        await v.validate('field', 'wo')
    } catch (error) {
        expect(error).toBe(false);
    }
    expect(await v.validate('field', 'wow')).toBe(true);
});

it('returns false when trying to validate a non-existant field.', async () => {
    try {
        await validator.validate('nonExistant', 'whatever');
    } catch (error) {
        expect(error).toBe(false);
    }
});

it('can detach rules', () => {
    const v = new Validator();
    
    v.attach('field', 'required');
    expect(v.$scopes.__global__.field).toBeTruthy();
    v.detach('field');
    expect(v.$scopes.__global__.field).toBeFalsy();
    // Silently fails if the field does not exist.
    expect(() => {
        v.detach('someOtherField');
    }).not.toThrow();
});

it('can validate specific scopes', async () => {
    const v = new Validator();
    
    v.attach('field', 'alpha', { getter: () => '123', context: () => 'context' });
    v.attach('field', 'alpha', { scope: 'myscope', getter: () => '123', context: () => 'context' });
    v.attach('field', 'alpha', { scope: 'otherscope', getter: () => '123', context: () => 'context' });

    // only '__global__' scope got validated.    
    try {
        await v.validateAll();
    } catch (error) {
        expect(v.errorBag.count()).toBe(1);
    }

    // the second scope too.
    try {
        await v.validateAll('myscope');
    } catch (error) {
        expect(v.errorBag.count()).toBe(2);
    }
    
    v.errorBag.clear();
    try {
        // all scopes.
        await v.validateScopes();
    } catch (error) {
        expect(v.errorBag.count()).toBe(3);
    }
});

it('can find errors by field and rule', () => {
    const v1 = new Validator({ name: 'alpha' });
    v1.validate('name', 12);

    expect(v1.errorBag.first('name:alpha')).toBe('The name field may only contain alphabetic characters.');
    expect(v1.errorBag.first('name:required')).toBeNull();
});

it('can extend the validator with a validator function', async () => {
    validator.extend('neg', (value) => Number(value) < 0);
    validator.attach('anotherField', 'neg');
    expect(await validator.validate('anotherField', -1)).toBe(true);
    try {
        await validator.validate('anotherField', 1);
    } catch (error) {
        expect(error).toBe(false);
    }
    // default message check.
    expect(validator.errorBag.first('anotherField')).toBe('The anotherField value is not valid.');
});

it('can extend the validators for a validator instance', async () => {
    const truthy = {
        getMessage: (field) => `The ${field} field value is not truthy.`,
        validate: (value) => !! value
    };

    Validator.extend('truthy', truthy); // static extend.
    validator.attach('anotherField', 'truthy');
    expect(await validator.validate('anotherField', 1)).toBe(true);
    try {
        await validator.validate('anotherField', 0)
    } catch (error) {
        expect(error).toBe(false);
    }
    expect(validator.errorBag.first('anotherField')).toBe('The anotherField field value is not truthy.');
});

it('can add a custom validator with localized messages', async () => {
    const falsy = {
        messages: {
            en: (field) => `The ${field} field value is not falsy.`,
            ar: () => 'Some Arabic Text'
        },
        validate: (value) => ! value
    };

    Validator.extend('falsy', falsy);
    validator.attach('anotherField', 'falsy');
    try {
        await validator.validate('anotherField', 1)
    } catch (error) {
        expect(error).toBe(false);
        expect(validator.errorBag.first('anotherField')).toBe('The anotherField field value is not falsy.');
    }

    validator.setLocale('ar');
    try {
        await validator.validate('anotherField', 1)
    } catch (error) {
        expect(error).toBe(false);
        expect(validator.errorBag.first('anotherField')).toBe('Some Arabic Text');
    }
});

it('can set the locale statically', async () => {
    Validator.updateDictionary({ ar: {
        messages: {
            alpha: () => 'البتاعة لازم يكون حروف بس'
        }
    }});
    Validator.setLocale('ar');
    const loc = new Validator({ name: 'alpha' });
    try {
        expect(await loc.validate('name', '1234')).toBe(false);
    } catch (error) {
        expect(loc.getLocale()).toBe('ar');
        expect(loc.getErrors().first('name')).toBe('البتاعة لازم يكون حروف بس');   
    }

    Validator.updateDictionary({ ar: null }); // reset the dictionary for other tests.
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

it('defaults to english messages if no current locale counterpart is found', async () => {
    const loc = new Validator({ first_name: 'alpha' });
    loc.setLocale('fr');
    loc.attach('first_name', 'alpha');
    try {
        await loc.validate('first_name', '0123');
    } catch (err) {
        expect(loc.errorBag.first('first_name')).toBe('The first_name field may only contain alphabetic characters.');
    }
});

it('can overwrite messages and add translated messages', async () => {
    const loc = new Validator({ first_name: 'alpha' });
    Validator.updateDictionary({
        ar: { messages: { alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.`} },
        en: { messages: { alpha: (field) => `${field} is alphabetic.` } }
    });
    loc.attach('first_name', 'alpha');
    try {
        await loc.validate('first_name', '0123');
    } catch (error) {
        expect(loc.errorBag.first('first_name')).toBe('first_name is alphabetic.');
    }

    loc.setLocale('ar');
    try {
        await loc.validate('first_name', '0123');
    } catch (error) {
        expect(loc.errorBag.first('first_name')).toBe('first_name يجب ان يحتوي على حروف فقط.');
    }

    loc.updateDictionary({
        ar: { messages: { alpha: () => 'My name is jeff' } }
    });

    try {
        await loc.validate('first_name', '0123');
    } catch (error) {
        expect(loc.errorBag.first('first_name')).toBe('My name is jeff');   
    }
});

it('sets locale for all validators', async () => {
    const v1 = new Validator({ first_name: 'alpha' });
    const v2 = new Validator({ first_name: 'alpha' });
    Validator.updateDictionary({
        ar: { messages: { alpha: (field) => 'عايز حروف'} },
        en: { messages: { alpha: (field) => `is alphabetic` } }
    });

    v1.setLocale('ar');
    try {
        await v1.validate('first_name', '213');
    } catch (err) {
        expect(v1.errorBag.first('first_name')).toBe('عايز حروف');
    }

    try {
        await v2.validate('first_name', '213');
    } catch (err) {
        expect(v2.errorBag.first('first_name')).toBe('عايز حروف');        
    }

    Validator.setLocale('en');
    // must regenerate.
    try {
        await v1.validate('first_name', '213');
    } catch (err) {
        expect(v1.errorBag.first('first_name')).toBe('is alphabetic');
    }
    try {
        await v2.validate('first_name', '213');

    } catch (err) {
        expect(v2.errorBag.first('first_name')).toBe('is alphabetic');
    }
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

    helpers.dimensionsTest({ width: 150, height: 100 }, false, global);
    expect(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)])).toBe(true);

    helpers.dimensionsTest({ width: 150, height: 100}, true, global);
    try {
        await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)]);
    } catch (error) {
        expect(error).toBe(false);        
    }

    try {
        await v.validate('image', [helpers.file('file.pdf', 'application/pdf', 10)]);
    } catch (error) {
        expect(error).toBe(false);        
    }

    helpers.dimensionsTest({ width: 30, height: 20}, false, global);
    try {
        await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)]);
    } catch (error) {
        expect(error).toBe(false);        
    }
});

it('wont install moment if the provided reference is not provided or not a function', () => {
    expect(Validator.installDateTimeValidators()).toBe(false);
    expect(Validator.installDateTimeValidators('But I am moment!')).toBe(false); // nope
});

it('installs date validators', async () => {
    const moment = require('moment');
    expect(Validator.installDateTimeValidators(moment)).toBe(true);
    const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

    helpers.querySelector({ name: 'field', value: '02/01/2008' });
    expect(await v.validate('birthday', '01/12/2008')).toBe(true);
    try {
        await v.validate('birthday', '01/01/2008');
    } catch (err) {
        expect(err).toBe(false);
    }
});

it('correctly parses rules with multiple colons', async () => {
    const v = new Validator({ time: 'date_format:HH:mm' });
    expect(await v.validate('time', '15:30')).toBe(true);
    try {
        await v.validate('time', '1700');
    } catch (err) {
        expect(err).toBe(false);
    }
});

it('auto installs date validators if moment is present globally', async () => {
    global.moment = require('moment');
    const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

    helpers.querySelector({ name: 'field', value: '02/01/2008' });
    expect(await v.validate('birthday', '01/12/2008')).toBe(true);
    try {
        await v.validate('birthday', '01/01/2008')
    } catch (err) {
        expect(err).toBe(false);
    }
});

it('can add custom names via the attributes dictionary', async () => {
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

    try {
        await v.validate('email', 'notvalidemail');
    } catch (err) {
        expect(err).toBe(false);   
    }
    expect(v.getErrors().first('email')).toBe('The Email Address field must be a valid email.');
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
    }).catch(error => {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    });
});

it('cascades promise values with previous fields', async () => {
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
    expect(result).toBe(true); // should pass

    try {
        await v.validateAll({
            email: 'somemeail', // not valid email.
            name: 'ProperName',
            phone: '11123112123'
        });
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');        
    }
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
    expect(v.errorBag.first('email')).toBe('The Email Address confirmation does not match.');
});


it('auto detect confirmation field when none given', async () => {
    const v = new Validator({
        password: 'confirmed'
    });

    helpers.querySelector({ name: 'password_confirmation', value: 'secret' });
    expect(await v.validate('password', 'secret')).toBe(true);

    try {
        await v.validate('password', 'fail');
    } catch (err) {
        expect(err).toBe(false);
    }
    expect(v.errorBag.first('password')).toBe('The password confirmation does not match.');
});

describe('validators can provide reasoning for failing', async () => {
    it('without promises', async () => {
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
        try {
            await v.validate('field', 'wow');
        } catch (err) {
            expect(err).toBe(false);
        }
        
        expect(v.errorBag.first('field')).toBe('Not correct');
    });

    it('using promises', async () => {
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
        try {
            await v.validate('reason_field', 'trigger');
        } catch (err) {
            expect(err).toEqual(false);
        }
        expect(v.errorBag.first('reason_field')).toBe('Not this value');
        try {
            await v.validate('reason_field', false); 
        } catch (err) {
            expect(err).toBe(false);
        }
        expect(v.errorBag.first('reason_field')).toBe('Something went wrong');
    });
});

it('can remove rules from the list of validators', async () => {
    Validator.extend('dummy', (value) => !! value);
    const v1 = new Validator({ name: 'dummy'});
    try {
        await v1.validate('name', false);
    } catch (err) {
        expect(err).toBe(false);
    }
    v1.remove('dummy');
    expect(() => {
        v1.validate('name', false)
    }).toThrow();
});

it('can fetch the values using getters when not specifying values in validateAll', async () => {
    const v = new Validator();
    const getter = (context) => {
        return context.value
    };
    let toggle = false;
    const context = () => {
        toggle = ! toggle;
        return { value: toggle ? 'valid' : '123' }
    };

    // must use the attach API.
    v.attach('name', 'required|alpha', { prettyName: 'Full Name', context, getter });
    
    expect(await v.validateAll()).toBe(true);
    expect(toggle).toBe(true);
    try {
        await v.validateAll();
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    }
});

it('can fetch the values using getters for a specific scope when not specifying values in validateAll', async () => {
    const v1 = new Validator();
    const contexts = [
        () => ({ value: 'martin' }),
        () => ({ value: 'invalid value' })
    ];
    const getter = (c) => c.value;

    // must use the attach API.
    v1.attach('name', 'required|alpha', { scope: () => 'scope1', context: contexts[0], getter });
    v1.attach('name_two', 'required|alpha', { scope: () => 'scope2', context: contexts[1], getter });

    expect(await v1.validateAll('scope1')).toBe(true);
    try {
        await v1.validateAll('scope2');
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    }

    try {
        await v1.validateAll();
    } catch (error) {
        expect(error.msg).toBe('[vee-validate]: Validation Failed');
    }
});

it('ignores empty rules', async () => {
    // contains two empty rules, one with params.
    const v1 = new Validator({ name: 'required|alpha||:blabla' });
    try {
        await v1.validate('name', 12);
    } catch (err) {
        expect(err).toBe(false);   
    }
    expect(await v1.validate('name', 'Martin')).toBe(true);
});

it('can update validations of a field', async () => {
    const v = new Validator({
        name: 'required|alpha'
    });
    try {
        await v.validate('name', 12) 
    } catch (err) {
        expect(err).toBe(false);
    }
    v.updateField('name', 'required|numeric', { scope: '__global__' });
    expect(v.errorBag.count()).toBe(0);
    expect(await v.validate('name', 12)).toBe(true);
});

it('handles dot notation names', async () => {
    const v = new Validator();
    v.attach('example.name', 'required|alpha');
    try {
        await v.validate('example.name', '')
    } catch (err) {
        expect(err).toBe(false);
    }
    expect(await v.validate('example.name', 'ad')).toBe(true);
});
