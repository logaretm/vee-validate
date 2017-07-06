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

beforeEach(() => {
  Validator.setLocale('en');
  Validator.updateDictionary({ ar: undefined }); // reset the dictionary for other tests.
  Validator.setStrictMode(true);
});

// All tests are serial because the locale is shared across all validators
// Which will result in a conflicting test cases.

test('empty values pass validation unless they are required', async () => {
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

  expect(await v.validate('content', '')).toBe(false);
  expect(await v.validate('email', 'loga')).toBe(false);
  expect(await v.validate('name', 'no')).toBe(false);
  expect(await v.validate('title', 'no')).toBe(false);

});

test('can validate single values', async () => {
  let v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });

  expect(await v.validate('title', 'abc')).toBe(true);
  expect(await v.validate('title', 'ab')).toBe(false);
  expect(await v.validate('title', '')).toBe(false);
  expect(await v.validate('title', 'a'.repeat(256))).toBe(false);

  v = new Validator();
  v.attach('el', 'required|min:3', { scope: 'scope' });
  expect(await v.validate('scope.el', '12')).toBe(false);
  expect(await v.validate('scope.el', '123')).toBe(true);
});

test('validates correctly regardless of rule placement', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });

  expect(await v.validate('title', 'Winter is coming')).toBe(true);
  expect(await v.validate('title', 'No')).toBe(false);
  expect(await v.validate('content', 'Winter is coming says everyone in the north')).toBe(false);
});

test('can be initialized with static create method', () => {
  const validator = Validator.create();
  expect(validator instanceof Validator).toBe(true);
});

test('can be initialized without validations', () => {
  const validator = new Validator();
  expect(validator instanceof Validator).toBe(true);
});

test('can add scopes', () => {
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

test('can allow rules object', async () => {
  const v = new Validator();
  v.attach('field', {
    required: true, // test boolean.
    regex: /.(js|ts)$/, // test single value.
    min: 5, // test single value.
    in: ['blabla.js', 'blabla.ts'] // test params
  });

  expect(await v.validate('field', '')).toBe(false);
  expect(await v.validate('field', 'blabla')).toBe(false);
  expect(await v.validate('field', 'g.js')).toBe(false);
  expect(await v.validate('field', 'else.js')).toBe(false);
  expect(await v.validate('field', 'blabla.js')).toBe(true);
  expect(await v.validate('field', 'blabla.ts')).toBe(true);
});

test('validates multiple values', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });

  expect(await v.validateAll({
    email: 'foo@bar.com',
    name: 'John Snow',
    title: 'Winter is coming',
    content: 'John knows nothing',
    tags: 1
  })).toBe(true);
  expect(v.errorBag.all()).toEqual([]);
});

test('fails validation on a one-of-many failure', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });
  expect(await v.validateAll({
    email: 'foo@bar.com',
    name: 'John Snow',
    title: 'No',
    content: 'John knows nothing',
    tags: 1
  })).toBe(false);
});

test('bypasses values without rules in strictMode = off', async () => {
  Validator.setStrictMode(false)
  const v = new Validator({
  imp: 'required'
  });
  const result = await v.validateAll({
    imp: 'Tyrion Lannister',
    headless: 'Ned Stark'
  });

  expect(result).toBe(true);
  expect(v.errorBag.all()).toEqual([]);
  Validator.setStrictMode(true); // reset strictMode for remaining tests.
});

test('can set strict mode on specific instances', async () => {
  const v = new Validator({
  imp: 'required'
  });
  
  try {
    let result = await v.validateAll({
      imp: 'Tyrion Lannister',
      headless: 'Ned Stark'
    });
  } catch (error) {
    expect(error.message).toBe(
      `[vee-validate] Validating a non-existant field: "headless". Use "attach()" first.`
    );
  }

  v.setStrictMode(false);
  let result = await v.validateAll({
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
    expect(error.message).toBe(
      `[vee-validate] Validating a non-existant field: "headless". Use "attach()" first.`
    );
  }
});

test('formats error messages', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });
  expect(await v.validateAll({
    email: 'foo@bar.c',
    name: '',
    title: 'Wi',
    content: 'John knows nothing about this validator',
    tags: 4
  })).toBe(false);

  expect(v.errorBag.all()).toEqual([
    'The email field must be a valid email.',
    'The name field is required.',
    'The title field must be at least 3 characters.',
    'The content field may not be greater than 20 characters.',
    'The tags field must be a valid value.'
  ]);
  expect(v.getErrors().all()).toEqual([
    'The email field must be a valid email.',
    'The name field is required.',
    'The title field must be at least 3 characters.',
    'The content field may not be greater than 20 characters.',
    'The tags field must be a valid value.'
  ]);
});
test('can attach new fields', async () => {
  const v = new Validator();

  expect(v.$scopes.__global__.field).toBeFalsy();
  v.attach('field', 'required|min:5');
  expect(v.$scopes.__global__.field).toBeTruthy();
  expect(await v.validate('field', 'less')).toBe(false);
  expect(await v.validate('field', 'not less')).toBe(true);
});

test('can attach new fields and display errors with custom names', async () => {
  const v = new Validator();
  v.attach('field', 'min:5', { prettyName: 'pretty' });
  await v.validate('field', 'wo');
  expect(v.getErrors().first('field')).toBe('The pretty field must be at least 5 characters.');
});

test('attaching new rules to an existing field should overwrite the old rules', async () => {
  const v = new Validator();
  v.attach('someField', 'required|min:3');
  expect(await v.validate('someField', 'wo')).toBe(false);

  // does it overwrite the old rule?
  v.attach('someField', 'min:1|max:3');
  expect(v.errorBag.collect('someField').length).toBe(0); // are field errors cleared?
  expect(await v.validate('someField', 'wo')).toBe(true);

  expect(await v.validate('someField', 'woww')).toBe(false);
});

test('can append new validations to a field', async () => {
  const validator = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });

  validator.attach('field', 'min:2', { prettyName: 'pretty' });
  validator.append('field', 'max:3', { prettyName: 'pretty' });
  expect(await validator.validate('field', 'wo')).toBe(true);
  expect(await validator.validate('field', 'wow')).toBe(true);
  
  expect(await validator.validate('field', 'woww')).toBe(false);
  expect(await validator.validate('field', 'w')).toBe(false);

  // attaches if the field doesn't exist.
  const v = new Validator();

  v.attach('field', 'min:2');
  v.detach('field');
  v.append('field', 'min:3');
  
  expect(await v.validate('field', 'wo')).toBe(false);
  expect(await v.validate('field', 'wow')).toBe(true);
});

test('fails when trying to validate a non-existant field when strict mode is true.', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|in:1,2,3,5'
  });
  
  expect(() => v.validate('nonExistant', 'whatever')).toThrow();
});

test('can detach rules', () => {
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

test('can validate specific scopes', async () => {
  const v = new Validator();

  v.attach('field', 'alpha', { getter: () => '123', context: () => 'context' });
  v.attach('field', 'alpha', { scope: 'myscope', getter: () => '123', context: () => 'context' });
  v.attach('field', 'alpha', { scope: 'otherscope', getter: () => '123', context: () => 'context' });

  // only '__global__' scope got validated.
  expect(await v.validateAll()).toBe(false);
  expect(v.errorBag.count()).toBe(1);

  // the second scope too.
  expect(await v.validateAll('myscope')).toBe(false);
  expect(v.errorBag.count()).toBe(2);


  v.errorBag.clear();
  expect(await v.validateScopes()).toBe(false);
  expect(v.errorBag.count()).toBe(3);
});

test('can validate specific scopes on an object', async () => {
  const v = new Validator({
    'field': 'required'
  });

  v.attach('field', 'required', { scope: 'myscope' })
  v.attach('anotherfield', 'required', { scope: 'myscope' })

  // only '__global__' scope got validated.
  expect(await v.validateAll({ field: null })).toBe(false);
  expect(v.errorBag.count()).toBe(1);

  // this time only 'myscope' got validated.
  v.errorBag.clear();
  expect(await v.validateAll({ field: null, anotherfield: null }, 'myscope')).toBe(false);
  expect(v.errorBag.count()).toBe(2);
})

test('can find errors by field and rule', async () => {
  const v = new Validator({ name: 'alpha' });
  expect(await v.validate('name', 12)).toBe(false);
  expect(v.errorBag.first('name:alpha')).toBeTruthy();
  expect(v.errorBag.first('name:required')).toBeFalsy();
});

test('can extend the validator with a validator function', async () => {
  const v = new Validator();
  v.extend('neg', (value) => Number(value) < 0);
  v.attach('anotherField', 'neg');
  expect(await v.validate('anotherField', -1)).toBe(true);
  expect(await v.validate('anotherField', 1)).toBe(false);
  expect(v.errorBag.first('anotherField')).toBe('The anotherField value is not valid.');
});

test('can extend the validators for a validator instance', async () => {
  const truthy = {
    getMessage: (field) => `The ${field} field value is not truthy.`,
    validate: (value) => !! value
  };

  Validator.extend('truthy', truthy); // static extend.
  const v = new Validator();
  v.attach('anotherField', 'truthy');
  expect(await v.validate('anotherField', 1)).toBe(true);
  expect(await v.validate('anotherField', 0)).toBe(false);
  expect(v.errorBag.first('anotherField')).toBe('The anotherField field value is not truthy.');
});

test('can add a custom validator with localized messages', async () => {
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
  expect(await v.validate('anotherField', 1)).toBe(false);
  expect(v.errorBag.first('anotherField')).toBe('The anotherField field value is not falsy.');

  v.setLocale('ar');
  expect(v.locale).toBe('ar');
  
  expect(await v.validate('anotherField', 1)).toBe(false);
  expect(v.errorBag.first('anotherField')).toBe('Some Arabic Text');
});

test('can set the locale statically', async () => {
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
  expect(loc.locale).toBe('ar');
  expect(loc.getErrors().first('name')).toBe('البتاعة لازم يكون حروف بس');
});

test('throws an exception when extending with an invalid validator', () => {
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
  }).not.toThrow();
});

test(
  'defaults to english messages if no current locale counterpart is found',
  async () => {
    const loc = new Validator({ first_name: 'alpha' });
    loc.setLocale('fr');
    loc.attach('first_name', 'alpha');
    await loc.validate('first_name', '0123');
    expect(loc.errorBag.first('first_name')).toBe('The first_name field may only contain alphabetic characters.');
  }
);

test('can overwrite messages and add translated messages', async () => {
  const loc = new Validator({ first_name: 'alpha' });
  Validator.updateDictionary({
    ar: { messages: { alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.`} },
    en: { messages: { alpha: (field) => `${field} is alphabetic.` } }
  });
  loc.attach('first_name', 'alpha');
  await loc.validate('first_name', '0123');
  expect(loc.errorBag.first('first_name')).toBe('first_name is alphabetic.');

  loc.setLocale('ar');
  await loc.validate('first_name', '0123');
  expect(loc.errorBag.first('first_name')).toBe('first_name يجب ان يحتوي على حروف فقط.');

  loc.updateDictionary({
    ar: { messages: { alpha: () => 'My name is jeff' } }
  });
  await loc.validate('first_name', '0123');
  expect(loc.errorBag.first('first_name')).toBe('My name is jeff');
});

test('sets locale for all validators', async () => {
  const v1 = new Validator({ first_name: 'alpha' });
  const v2 = new Validator({ first_name: 'alpha' });
  Validator.updateDictionary({
    ar: { messages: { alpha: () => 'عايز حروف'} },
    en: { messages: { alpha: () => 'is alphabetic' } }
  });

  v1.setLocale('ar');
  await v1.validate('first_name', '213');
  expect(v1.errorBag.first('first_name')).toBe('عايز حروف');

  await v2.validate('first_name', '213');
  expect(v2.errorBag.first('first_name')).toBe('عايز حروف');

  // doesn't matter which instance sets the locale.
  v2.setLocale('en');
  await v1.validate('first_name', '213');
  expect(v1.errorBag.first('first_name')).toBe('is alphabetic');
  await v2.validate('first_name', '213');
  expect(v2.errorBag.first('first_name')).toBe('is alphabetic');
});

test('resolves promises to booleans', async () => {
  const params = [150, 100];
  const v = new Validator({
    image: 'dimensions:150,100'
  });

  helpers.dimensionsTest({ width: 150, height: 100 }, false, global);
  expect(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)])).toBe(true);

  helpers.dimensionsTest({ width: 150, height: 100}, true, global);
  expect(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)])).toBe(false);

  helpers.dimensionsTest({ width: 30, height: 20}, false, global);
  expect(await v.validate('image', [helpers.file('file.jpg', 'image/jpeg', 10)])).toBe(false);
});

test('promises can return booleans directly', async () => {
  Validator.extend('direct', (value) => {
    return new Promise(resolve => resolve(!!value));
  });
  const v = new Validator({
    field: 'required|direct'
  });
  expect(await v.validate('field', 0)).toBe(false);
  expect(await v.validate('field', false)).toBe(false);
  expect(await v.validate('field', true)).toBe(true);

  Validator.remove('direct');
})

test('wont install moment if the provided reference is not provided or not a function', () => {
  expect(Validator.installDateTimeValidators()).toBe(false);
  expect(Validator.installDateTimeValidators('But I am moment!')).toBe(false); // nope
});

test('installs date validators', async () => {
  const moment = require('moment');
  expect(Validator.installDateTimeValidators(moment)).toBe(true);
  const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

  helpers.querySelector({ name: 'field', value: '02/01/2008' });
  expect(await v.validate('birthday', '01/12/2008')).toBe(true);

  expect(await v.validate('birthday', '01/01/2008')).toBe(false);
});

test('correctly parses rules with multiple colons', async () => {
  const v = new Validator({ time: 'date_format:HH:mm' });
  expect(await v.validate('time', '15:30')).toBe(true);
  expect(await v.validate('time', '1700')).toBe(false);
});

test('auto installs date validators if moment is present globally', async () => {
  global.moment = require('moment');
  const v = new Validator({ birthday: 'date_format:DD/MM/YYYY|after:field' });

  helpers.querySelector({ name: 'field', value: '02/01/2008' });
  expect(await v.validate('birthday', '01/12/2008')).toBe(true);
  expect(await v.validate('birthday', '01/01/2008')).toBe(false);
});

test('can add custom names via the attributes dictionary', async () => {
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

  expect(await v.validate('email', 'notvalidemail')).toBe(false);
  expect(v.getErrors().first('email')).toBe('The Email Address field must be a valid email.');
});

test('cascades promise values with previous boolean', async () => {
  const v = new Validator({ email: 'required|promised|email' });
  const result = v.validate('email', 'someemail@email.com');
  expect(typeof result.then === 'function').toBe(true);
  expect(await v.validate('email', 'invalid')).toBe(false);
});

test('cascades promise values with previous fields', async () => {
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

  expect(await v.validateAll({
    email: 'somemeail', // not valid email.
    name: 'ProperName',
    phone: '11123112123'
  })).toBe(false);
});

test('can translate target field for field dependent validations', async () => {
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
  expect(v.errorBag.first('birthday')).toBe('The Birthday must be after Some Date.');
});


test('auto detect confirmation field when none given', async () => {
  const v = new Validator({
    password: 'confirmed'
  });

  helpers.querySelector({ name: 'password_confirmation', value: 'secret' });
  expect(await v.validate('password', 'secret')).toBe(true);
  expect(await v.validate('password', 'fail')).toBe(false);
  expect(v.errorBag.first('password')).toBe('The password confirmation does not match.');
});

test('without promises', async () => {
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
  
    expect(await v.validate('field', 'wow')).toBe(false);


  expect(v.errorBag.first('field')).toBe('Not correct');
});

test('using promises', async () => {
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
  
    expect(await v.validate('reason_field', 'trigger')).toBe(false);

  expect(v.errorBag.first('reason_field')).toBe('Not this value');
  
    expect(await v.validate('reason_field', false)).toBe(false);

  expect(v.errorBag.first('reason_field')).toBe('Something went wrong');
});

test('can remove rules from the list of validators', async () => {
  Validator.extend('dummy', (value) => !! value);
  const v1 = new Validator({ name: 'dummy'});
  
    await v1.validate('name', false);

  v1.remove('dummy');
  expect(() => {
    v1.validate('name', false)
  }).toThrow();
});

test('can fetch the values using getters when not specifying values in validateAll', async () => {
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

  expect(await v.validateAll()).toBe(true);
  expect(toggle).toBe(true);
  expect(await v.validateAll()).toBe(false);
});

test('can fetch the values using getters for a specific scope when not specifying values in validateAll', async () => {
  const v1 = new Validator();
  const contexts = [
    () => ({ value: 'martin' }),
    () => ({ value: 'invalid value' })
  ];
  const getter = (c) => c.value;

  // must use the attach API.
  v1.attach('name', 'required|alpha', { scope: 'scope1', context: contexts[0], getter });
  v1.attach('name_two', 'required|alpha', { scope: 'scope2', context: contexts[1], getter });

  expect(await v1.validateAll('scope1')).toBe(true);
  expect(await v1.validateAll('scope2')).toBe(false);    
});

test('ignores empty rules', async () => {
  // contains two empty rules, one with params.
  const v1 = new Validator({ name: 'required|alpha||:blabla' });
  expect(await v1.validate('name', 12)).toBe(false);
  expect(await v1.validate('name', 'Martin')).toBe(true);
});

test('can update validations of a field', async () => {
  const v = new Validator({
    name: 'required|alpha'
  });
  expect(await v.validate('name', 12)).toBe(false);
  v.updateField('name', 'required|numeric', { scope: '__global__' });
  expect(v.errorBag.count()).toBe(0);
  expect(await v.validate('name', 12)).toBe(true);
});

test('handles dot notation names', async () => {
  const v = new Validator();
  v.attach('example.name', 'required|alpha');
  expect(await v.validate('example.name', '')).toBe(false);
  expect(await v.validate('example.name', 'ad')).toBe(true);
});

test('sets aria attributes on elements', async () => {
  const v = new Validator();
  let el = document.createElement('input');
  v.attach('name', 'required', {
    listeners: { el }
  });
  expect(el.getAttribute('aria-required')).toBe('true');
  el = document.createElement('input');
  v.attach('valid', 'alpha', {
    listeners: { el }
  });
  expect(el.getAttribute('aria-required')).toBe('false');
  expect(el.getAttribute('aria-invalid')).toBe('false');
  expect(await v.validate('valid', '123')).toBe(false);
  expect(el.getAttribute('aria-invalid')).toBe('true');

  await v.validate('valid', 'abc');
  expect(el.getAttribute('aria-invalid')).toBe('false');
});

test('it can add events via on', () => {
  const v = new Validator();
  v.attach('name', 'required', {
    scope: 'scope'
  });
  v.on('after', 'name', 'scope', () => {});
  expect(typeof v.$scopes['scope'].name.events.after === 'function').toBe(true);
  v.attach('dotted.name', 'required');
  v.on('after', 'dotted.name', '__global__', () => {});
  expect(typeof v.$scopes.__global__['dotted.name'].events.after === 'function').toBe(true);
});

test('it can remove events via off', () => {
  const v = new Validator();
  v.attach('name', 'required', {
    scope: 'scope'
  });
  v.on('after', 'name', 'scope', () => {});
  v.off('after', 'name', 'scope');
  expect(typeof v.$scopes['scope'].name.events.after === 'undefined').toBe(true);
  v.attach('dotted.name', 'required');
  v.on('after', 'dotted.name', '__global__', () => {});
  v.off('after', 'dotted.name', '__global__');
  expect(typeof v.$scopes.__global__['dotted.name'].events.after === 'undefined').toBe(true);
});

test('validations can be paused and resumed', async () => {
  const v = new Validator();
  v.attach('name', 'required');

  v.pause();

  expect(await v.validate('name', '')).toBe(true);
  expect(await v.validateAll()).toBe(true);
  expect(await v.validateScopes()).toBe(true);
  
  v.resume();
  expect(await v.validate('name', '')).toBe(false);

  expect(await v.validateAll({
    name: ''
  })).toBe(false);
});

test('it can hold multiple errors for one field', async () => {
  const v = new Validator({
    name: 'alpha|min:3'
  }, { fastExit: false });
  expect(await v.validate('name', '2')).toBe(false);
  expect(v.errorBag.count()).toBe(2);
});

test('it can set flags for attached fields', () => {
  const v = new Validator();
  v.attach('name', 'alpha');
  expect(v.fieldBag.name.untouched).toBe(true);

  v.flag('name', {
    untouched: false
  });
  expect(v.fieldBag.name.untouched).toBe(false);

  // scoped fields
  v.attach('email', 'email', { scope: 'myscope' });
  expect(v.fieldBag.$myscope.email.untouched).toBe(true);
  v.flag('myscope.email', {
    untouched: false
  });
  expect(v.fieldBag.$myscope.email.untouched).toBe(false);

  // dotted name fields
  v.attach('form.title', 'alpha');
  expect(v.fieldBag['form.title'].untouched).toBe(true);
  v.flag('form.title', {
    untouched: false
  });
  expect(v.fieldBag['form.title'].untouched).toBe(false);
});

test('it can hold handle mixed successes and errors from one field', async () => {
  const v = new Validator({
    name: 'alpha|min:3'
  }, { fastExit: false });
  expect(await v.validate('name', '123')).toBe(false);
  expect(v.errorBag.count()).toBe(1);
});
