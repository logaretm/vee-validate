import Validator from './../src/validator';
import Field from './../src/field';
import helpers from './helpers';
import moment from 'moment';

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
  let v = new Validator({ title: 'required|min:3|max:255' });
  expect(await v.validate('title', 'abc')).toBe(true);
  expect(await v.validate('title', 'ab')).toBe(false);
  expect(await v.validate('title', '')).toBe(false);
  expect(await v.validate('title', 'a'.repeat(256))).toBe(false);

  v = new Validator();
  v.attach('el', 'required|min:3', { scope: 'scope' });
  expect(await v.validate('scope.el', '12')).toBe(false);
  expect(await v.validate('scope.el', '123')).toBe(true);
});

test('rule placement does n', async () => {
  const v = new Validator({
    title: 'min:3|max:255|required',
    content: 'required|max:20',
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
  expect(v.errors.all()).toEqual([]);
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
  expect(v.errors.all()).toEqual([]);
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

  v.strict = false;
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

  expect(v.errors.all()).toEqual([
    'The email field must be a valid email.',
    'The name field is required.',
    'The title field must be at least 3 characters.',
    'The content field may not be greater than 20 characters.',
    'The tags field must be a valid value.'
  ]);
  expect(v.errors.all()).toEqual([
    'The email field must be a valid email.',
    'The name field is required.',
    'The title field must be at least 3 characters.',
    'The content field may not be greater than 20 characters.',
    'The tags field must be a valid value.'
  ]);
});
test('can attach new fields', async () => {
  const v = new Validator();

  expect(v.fields.find({ name: 'field' })).toBeFalsy();
  v.attach('field', 'required|min:5');
  expect(v.fields.find({ name: 'field' })).toBeTruthy();
  expect(await v.validate('field', 'less')).toBe(false);
  expect(await v.validate('field', 'not less')).toBe(true);
});

test('can display errors with custom field names', async () => {
  const v = new Validator();
  v.attach('field', 'min:5', { alias: 'pretty' });
  await v.validate('field', 'wo');
  expect(v.errors.first('field')).toBe('The pretty field must be at least 5 characters.');
});

test.skip('attaching new rules to an existing field should overwrite the old rules', async () => {
  const v = new Validator();
  v.attach('someField', 'required|min:3');
  expect(await v.validate('someField', 'wo')).toBe(false);

  // does it overwrite the old rule?
  v.attach('someField', 'min:1|max:3');
  expect(v.errors.collect('someField').length).toBe(0); // are field errors cleared?
  expect(await v.validate('someField', 'wo')).toBe(true);

  expect(await v.validate('someField', 'woww')).toBe(false);
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

test('can detach fields', () => {
  const v = new Validator();

  v.attach('field', 'required');
  expect(v.fields.find({ name: 'field' })).toBeTruthy();
  v.detach('field');
  expect(v.fields.find({ name: 'field' })).toBeFalsy();
  // Silently fails if the field does not exist.
  expect(() => {
    v.detach('someOtherField');
  }).not.toThrow();
});

test('can validate specific scopes', async () => {
  const v = new Validator();

  v.attach('field', 'alpha', { getter: () => '123' });
  v.attach('field', 'alpha', { scope: 'myscope', getter: () => '123' });
  v.attach('field', 'alpha', { scope: 'otherscope', getter: () => '123' });

  // only '__global__' scope got validated.
  expect(await v.validateAll()).toBe(false);
  expect(v.errors.count()).toBe(1);
  // the second scope too.
  expect(await v.validateAll('myscope')).toBe(false);
  expect(v.errors.count()).toBe(2);
  v.errors.clear();
  expect(await v.validateScopes()).toBe(false);
  expect(v.errors.count()).toBe(3);
});

test('can validate specific scopes on an object', async () => {
  const v = new Validator({
    'field': 'required'
  });

  v.attach('field', 'required', { scope: 'myscope' })
  v.attach('anotherfield', 'required', { scope: 'myscope' })

  // only global scope got validated.
  expect(await v.validateAll({ field: null })).toBe(false);
  expect(v.errors.count()).toBe(1);

  // this time only 'myscope' got validated.
  v.errors.clear();
  expect(await v.validateAll({ field: null, anotherfield: null }, 'myscope')).toBe(false);
  expect(v.errors.count()).toBe(2);
});

test('can find errors by field and rule', async () => {
  const v = new Validator({ name: 'alpha' });
  expect(await v.validate('name', 12)).toBe(false);
  expect(v.errors.first('name:alpha')).toBeTruthy();
  expect(v.errors.first('name:required')).toBeFalsy();
});

test('can extend the validator with a validator function', async () => {
  const v = new Validator();
  v.extend('neg', (value) => Number(value) < 0);
  v.attach('anotherField', 'neg');
  expect(await v.validate('anotherField', -1)).toBe(true);
  expect(await v.validate('anotherField', 1)).toBe(false);
  expect(v.errors.first('anotherField')).toBe('The anotherField value is not valid.');
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
  expect(v.errors.first('anotherField')).toBe('The anotherField field value is not truthy.');
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
  expect(v.errors.first('anotherField')).toBe('The anotherField field value is not falsy.');

  v.setLocale('ar');
  expect(v.locale).toBe('ar');
  
  expect(await v.validate('anotherField', 1)).toBe(false);
  expect(v.errors.first('anotherField')).toBe('Some Arabic Text');
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
  await loc.validate('name', '1234');
  expect(loc.locale).toBe('ar');
  expect(loc.errors.first('name')).toBe('البتاعة لازم يكون حروف بس');
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
    expect(loc.errors.first('first_name')).toBe('The first_name field may only contain alphabetic characters.');
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
  expect(loc.errors.first('first_name')).toBe('first_name is alphabetic.');

  loc.setLocale('ar');
  await loc.validate('first_name', '0123');
  expect(loc.errors.first('first_name')).toBe('first_name يجب ان يحتوي على حروف فقط.');

  loc.updateDictionary({
    ar: { messages: { alpha: () => 'My name is jeff' } }
  });
  await loc.validate('first_name', '0123');
  expect(loc.errors.first('first_name')).toBe('My name is jeff');
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
  expect(v1.errors.first('first_name')).toBe('عايز حروف');

  await v2.validate('first_name', '213');
  expect(v2.errors.first('first_name')).toBe('عايز حروف');

  // doesn't matter which instance sets the locale.
  v2.setLocale('en');
  await v1.validate('first_name', '213');
  expect(v1.errors.first('first_name')).toBe('is alphabetic');
  await v2.validate('first_name', '213');
  expect(v2.errors.first('first_name')).toBe('is alphabetic');
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
  document.body.innerHTML = `<input type="text" name="field" value="" id="el">`;
  const el = document.querySelector('#el');
  expect(Validator.installDateTimeValidators(moment)).toBe(true);
  const v = new Validator();
  v.attach({
    name: 'birthday',
    vm: {
      $el: document.body
    },
    rules: 'date_format:DD/MM/YYYY|after:field'
  });

  el.value = '02/01/2008';
  expect(await v.validate('birthday', '01/12/2008')).toBe(true);
  expect(await v.validate('birthday', '01/01/2008')).toBe(false);
});

test('correctly parses rules with multiple colons', async () => {
  const v = new Validator({ time: 'date_format:HH:mm' });
  expect(Validator.installDateTimeValidators(moment)).toBe(true);
  expect(await v.validate('time', '15:30')).toBe(true);
  expect(await v.validate('time', '1700')).toBe(false);
});

test('auto installs date validators if moment is present globally', async () => {
  global.moment = require('moment');
  document.body.innerHTML = `<input type="text" name="field" value="" id="el">`;
  const el = document.querySelector('#el');
  const v = new Validator();
  v.attach({
    name: 'birthday',
    vm: {
      $el: document.body
    },
    rules: 'date_format:DD/MM/YYYY|after:field'
  });
  el.value = '02/01/2008';
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
  expect(v.errors.first('email')).toBe('The Email Address field must be a valid email.');
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
  global.moment = require('moment');
  document.body.innerHTML = `<input type="text" name="birthday_min" value="" id="el">`;
  const el = document.querySelector('#el');
  const v = new Validator();
  v.attach({
    name: 'birthday',
    vm: {
      $el: document.body
    },
    rules: 'date_format:DD-MM-YYYY|after:birthday_min'
  });
  v.updateDictionary({
    en: {
      attributes: {
        birthday: 'Birthday',
        birthday_min: 'Some Date'
      }
    }
  });

  el.value = '12-09-2017';
  await v.validate('birthday', '11-09-2017');
  expect(v.errors.first('birthday')).toBe('The Birthday must be after Some Date.');
});


test('auto detect confirmation field when none given', async () => {
  document.body.innerHTML = `<input type="text" name="password_confirmation" value="secret" id="el">`;
  const el = document.querySelector('#el');
  const v = new Validator();
  v.attach({
    name: 'password',
    vm: {
      $el: document.body
    },
    rules: 'confirmed'
  });

  expect(await v.validate('password', 'secret')).toBe(true);
  expect(await v.validate('password', 'fail')).toBe(false);
  expect(v.errors.first('password')).toBe('The password confirmation does not match.');
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


  expect(v.errors.first('field')).toBe('Not correct');
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

  expect(v.errors.first('reason_field')).toBe('Not this value');
  
    expect(await v.validate('reason_field', false)).toBe(false);

  expect(v.errors.first('reason_field')).toBe('Something went wrong');
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

test('calling validate without args will trigger validateAll', async () => {
  const v = new Validator();
  v.validateScopes = jest.fn(async () => {});

  await v.validate();
  expect(v.validateScopes).toHaveBeenCalled();
});

test('calling validate with * will trigger validateScopes', async () => {
  const v = new Validator();
  v.validateAll = jest.fn(async () => { });

  await v.validate('*');
  expect(v.validateAll).toHaveBeenCalled();
});

test('calling validate with a string ending with .* will validate the matched scope', async () => {
  const v = new Validator();
  v.validateAll = jest.fn(async () => { });

  await v.validate('scope-1.*');
  expect(v.validateAll).toHaveBeenCalledWith('scope-1');
});

test('can fetch the values using getters when not specifying values in validateAll', async () => {
  const v = new Validator();
  let toggle = false;
  const getter = () => {
    toggle = !toggle;
    return toggle ? 'valid' : '123';
  };

  v.attach('name', 'required|alpha', { getter });

  expect(await v.validateAll()).toBe(true);
  expect(toggle).toBe(true);
  expect(await v.validateAll()).toBe(false);
});

test('can fetch the values using getters for a specific scope when not specifying values in validateAll', async () => {
  const v1 = new Validator();
  const getter1 = () => 'martin';
  const getter2 = () => 'invalid value';

  v1.attach('name', 'required|alpha', { scope: 'scope1', getter: getter1 });
  v1.attach('name', 'required|alpha', { scope: 'scope2', getter:getter2 });

  expect(await v1.validateAll('scope1')).toBe(true);
  expect(await v1.validateAll('scope2')).toBe(false);    
});

test('ignores empty rules', async () => {
  // contains two empty rules, one with params.
  const v1 = new Validator({ name: 'required|alpha||:blabla' });
  expect(await v1.validate('name', 12)).toBe(false);
  expect(await v1.validate('name', 'Martin')).toBe(true);
});

test('handles dot notation names', async () => {
  const v = new Validator();
  v.attach('example.name', 'required|alpha');
  expect(await v.validate('example.name', '')).toBe(false);
  expect(await v.validate('example.name', 'ad')).toBe(true);
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
  expect(v.errors.count()).toBe(2);
});

test('it can set flags for attached fields', () => {
  const v = new Validator();
  let field = v.attach('name', 'alpha');
  expect(field.flags.untouched).toBe(true);

  v.flag('name', { untouched: false });
  expect(field.flags.untouched).toBe(false);

  // scoped fields
  v.attach('email', 'email', { scope: 'myscope' });
  expect(v.fieldBag.$myscope.email.untouched).toBe(true);
  v.flag('myscope.email', { untouched: false });
  expect(v.fieldBag.$myscope.email.untouched).toBe(false);

  // dotted name fields
  field = v.attach('form.title', 'alpha');
  expect(field.flags.untouched).toBe(true);
  v.flag('form.title', { untouched: false });
  expect(field.flags.untouched).toBe(false);

  // non-existant flags fails silently
  expect(() => {
    v.flag('crap', { untouched: false });
  }).not.toThrow();

  // calls update classes.
  field = v.attach(new Field(document.createElement('input'), {
    name: 'somefield',
    rules: 'alpha',
    classes: true
  }));
  field.updateClasses = jest.fn();

  v.flag('somefield', { dirty: true });
  expect(field.updateClasses).toHaveBeenCalled();
});

test('resets errors on the next tick if available', () => {
  // not available.
  let v = new Validator();
  const vm = { $nextTick: jest.fn(cb => cb()) };
  v.errors.add('some', 'message', 'by');
  v.reset();
  expect(v.errors.count()).toBe(0);

  v = new Validator(null, { vm });
  v.errors.add('some', 'message', 'by');
  v.reset();
  expect(vm.$nextTick).toHaveBeenCalled();
  expect(v.errors.count()).toBe(0);
})

test('it can handle mixed successes and errors from one field regardless of rules order', async () => {
  const v = new Validator({
    string1: 'alpha|min:3',
    string2: 'min:3|alpha',
    string3: 'alpha|min:3',
    string4: 'min:3|alpha'
  }, { fastExit: false });

  expect(await v.validate('string1', '123')).toBe(false);
  expect(await v.validate('string2', '123')).toBe(false);
  expect(await v.validate('string3', 'abc')).toBe(true);
  expect(await v.validate('string4', 'abc')).toBe(true);
});

test('exposes static readonly dictionary property', () => {
  expect(typeof Validator.dictionary).toBe('object');
});

test('exposes static and instance readonly rules properties', () => {
  const v = new Validator();
  expect(typeof v.rules).toBe('object');
  expect(typeof Validator.rules).toBe('object');
});

test('validate can resolve the value if it was not provided', async () => {
  const v = new Validator();
  const field = v.attach('field', 'alpha', { getter: () => '123' });
  expect(await v.validate(`#${field.id}`)).toBe(false);
});

test('resolves a field by name and scope', async () => {
  const v = new Validator();
  const field = v.attach('field', 'alpha', { scope: 's1' });
  expect(v._resolveField('field', 's1')).toBe(field);
});

test('handles unresolved fields when strict is false by returning true', async () => {
  const v = new Validator();
  v.strict = false;
  expect(await v.validate('#plasd')).toBe(true);
});

test('updates classes after validating a field', async () => {
  const v = new Validator();
  const field = v.attach('field', 'alpha', { el: document.createElement('input'), classes: true });
  field.updateClasses = jest.fn();
  expect(await v.validate(`#${field.id}`, '123')).toBe(false);
  expect(field.updateClasses).toHaveBeenCalled();
});

test('triggers initial validation for fields', async () => {
  const v = new Validator();
  v.validate = jest.fn();
  const field = v.attach('field', 'alpha', { el: document.createElement('input'), getter: () => '123', initial: true });
  expect(v.validate).toHaveBeenCalledWith(`#${field.id}`, '123');
});

test('adds locale objects to dictionary', () => {
  global.console.warn = jest.fn();
  Validator.addLocale({});
  expect(global.console.warn).toHaveBeenCalled();
  const v = new Validator();
  const locale = {
    name: 'ar',
    messages: {}
  };
  v.addLocale(locale);
  expect(v.dictionary.container.ar).toEqual(locale);
});

test('validates multi-valued promises', async () => {
  Validator.extend('many_promise', () => {
    return new Promise(resolve => {
      resolve([
        { valid: true },
        true
      ]);
    });
  });

  const v = new Validator();
  v.attach('field', 'many_promise');
  expect(await v.validate('field', 'sdad')).toBe(true);
});

test('it should pass the after/before inclusion parameters correctly', async () => {
  document.body.innerHTML = `<input type="text" name="field" value="" id="el">`;
  const el = document.querySelector('#el');
  expect(Validator.installDateTimeValidators(moment)).toBe(true);
  const v = new Validator();
  v.attach({
    name: 'birthday',
    vm: {
      $el: document.body
    },
    rules: 'date_format:DD/MM/YYYY|after:field,true'
  });

  el.value = '01/12/2008';
  expect(await v.validate('birthday', '01/12/2008')).toBe(true);
  expect(await v.validate('birthday', '01/11/2008')).toBe(false);
});

test('it does not validate disabled fields', async () => {
  document.body.innerHTML = `<input type="text" name="field" value="" disabled id="el">`;
  const el = document.querySelector('#el');
  const v = new Validator();
  const field = v.attach({
    el,
    rules: 'required|email'
  });

  expect(await v.validate(`#${field.id}`)).toBe(true);
  el.disabled = false;
  expect(await v.validate(`#${field.id}`)).toBe(false);
});

test('some fields can blacklist false as a non-empty value', async () => {
  const el = document.createElement('input');
  el.type = "checkbox";
  el.name = "field";
  let val = true;
  const v = new Validator();
  const field = v.attach({
    el,
    rules: 'required',
    getter: () => {
      return val
    }
  });
  expect(await v.validate(`#${field.id}`)).toBe(true);
  val = false;
  expect(await v.validate(`#${field.id}`)).toBe(false);

  el.type = 'text'; // checboxes accept false as a value.
  expect(await v.validate(`#${field.id}`)).toBe(true);
});