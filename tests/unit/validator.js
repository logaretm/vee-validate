import { createLocalVue } from '@vue/test-utils';
import Field from '@/core/field';
import VeeValidate from '@/index';
import flushPromises from 'flush-promises';

const Vue = createLocalVue();
const Validator = VeeValidate.Validator;
VeeValidate.install(Vue);

// Converts the value to a boolean and returns it in a promise.
Validator.extend('promised', (value) => {
  return new Promise(resolve => {
    resolve({
      valid: !! value
    });
  });
});

beforeEach(() => {
  Validator.localize('en');
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

  expect(await v.validate('content', [])).toBe(false);
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
  v.attach({ name: 'el', rules: 'required|min:3', scope: 'scope' });
  expect(await v.validate('scope.el', '12')).toBe(false);
  expect(await v.validate('scope.el', '123')).toBe(true);
});

test('rule placement does not affect the result', async () => {
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

test('accepts rules as an object', async () => {
  const v = new Validator();
  v.attach({
    name: 'field',
    rules: {
      required: true, // test boolean.
      regex: /.(js|ts)$/, // test single value.
      min: 5, // test single value.
      included: ['blabla.js', 'blabla.ts'] // test params
    }
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
    tags: 'required|included:1,2,3,5'
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
    tags: 'required|included:1,2,3,5'
  });
  expect(await v.validateAll({
    email: 'foo@bar.com',
    name: 'John Snow',
    title: 'No',
    content: 'John knows nothing',
    tags: 1
  })).toBe(false);
});

test('formats error messages', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|included:1,2,3,5'
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

test('can manually attach new fields', async () => {
  const v = new Validator();

  expect(v.fields.find({ name: 'field' })).toBeFalsy();
  v.attach({ name: 'field', rules: 'required|min:5' });
  expect(v.fields.find({ name: 'field' })).toBeTruthy();
  expect(await v.validate('field', 'less')).toBe(false);
  expect(await v.validate('field', 'not less')).toBe(true);
});

test('can display errors with custom field names', async () => {
  const v = new Validator();
  v.attach({ name: 'field', rules: 'min:5', alias: 'pretty' });
  await v.validate('field', 'wo');
  expect(v.errors.first('field')).toBe('The pretty field must be at least 5 characters.');
});

test('fails when trying to validate a non-existant field.', async () => {
  const v = new Validator({
    email: 'required|email',
    name: 'required|min:3',
    title: 'required|min:3|max:255',
    content: 'required|max:20',
    tags: 'required|included:1,2,3,5'
  });

  await expect(v.validate('nonExistant', 'whatever')).rejects.toBeTruthy();
});

test('can detach fields', () => {
  const v = new Validator();

  v.attach({ name: 'field', rules: 'required' });
  expect(v.fields.find({ name: 'field' })).toBeTruthy();
  v.detach('field');
  expect(v.fields.find({ name: 'field' })).toBeFalsy();
  // Silently fails if the field does not exist.
  expect(() => {
    v.detach('someOtherField');
  }).not.toThrow();

  v.attach({
    name: 'field',
    rules: 'required',
    scope: 'myscope'
  });
  v.detach('myscope.field');
  expect(v.fields.find({ name: 'field', scope: 'myscope' })).toBeFalsy();
});

test('can validate specific scopes', async () => {
  const v = new Validator();

  v.attach({ name: 'field', rules: 'alpha', getter: () => '123' });
  v.attach({ name: 'field', rules: 'alpha', scope: 'myscope', getter: () => '123' });
  v.attach({ name: 'field', rules: 'alpha', scope: 'otherscope', getter: () => '123' });

  expect(await v.validate('*')).toBe(false);
  expect(v.errors.count()).toBe(1);
  // the second scope too.
  expect(await v.validate('myscope.*')).toBe(false);
  expect(v.errors.count()).toBe(2);
  v.errors.clear();
  expect(await v.validateScopes()).toBe(false);
  expect(v.errors.count()).toBe(3);
});

test('can validate specific scopes on an object', async () => {
  const v = new Validator({
    'field': 'required'
  });

  v.attach({ name: 'field', rules: 'required', scope: 'myscope' });
  v.attach({ name: 'anotherfield', rules: 'required', scope: 'myscope' });

  // only global scope got validated.
  expect(await v.validateAll({ field: null })).toBe(false);
  expect(v.errors.count()).toBe(1);
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
  v.attach({ name: 'anotherField', rules: 'neg' });
  expect(await v.validate('anotherField', -1)).toBe(true);
  expect(await v.validate('anotherField', 1)).toBe(false);
  expect(v.errors.first('anotherField')).toBe('The anotherField value is not valid.');
});

test('can extend the validators with a validator instance', async () => {
  const truthy = {
    getMessage: (field) => `The ${field} field value is not truthy.`,
    validate: (value) => !! value
  };

  Validator.extend('truthy', truthy); // static extend.
  const v = new Validator();
  v.attach({ name: 'anotherField', rules: 'truthy' });
  expect(await v.validate('anotherField', 1)).toBe(true);
  expect(await v.validate('anotherField', 0)).toBe(false);
  expect(v.errors.first('anotherField')).toBe('The anotherField field value is not truthy.');
});

test('add rules than can target other fields', async () => {
  const v = new Validator();
  v.extend('isBigger', (value, [other]) => {
    return value > other;
  }, { hasTarget: true });
  document.body.innerHTML = `<input type="text" name="field" value="10" id="el">`;
  const el = document.querySelector('#el');
  v.attach({
    name: 'otherField',
    vm: {
      $el: document.body,
      $refs: {
        field: el
      }
    },
    rules: 'isBigger:field'
  });

  el.value = 11;

  expect(await v.validate('otherField', 10)).toBe(false);
  expect(await v.validate('otherField', 12)).toBe(true);
});

test('can set the locale statically', async () => {
  Validator.localize('ar', {
    messages: {
      alpha: () => 'البتاعة لازم يكون حروف بس'
    }
  });
  const v = new Validator();
  expect(v.locale).toBe('ar');
  v.attach({ name: 'name', rules: 'alpha' });
  await v.validate('name', '1234');
  expect(v.errors.first('name')).toBe('البتاعة لازم يكون حروف بس');
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
  // numeric is already registered.
  expect(() => {
    Validator.extend('numeric', { getMessage: name => name, validate: () => true });
  }).not.toThrow();
});

test('can overwrite messages and add translated messages', async () => {
  const loc = new Validator({ first_name: 'alpha' });
  Validator.localize('ar', { messages: { alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.` } });
  Validator.localize('en', { messages: { alpha: (field) => `${field} is alphabetic.` } });

  loc.attach({ name: 'first_name', rules: 'alpha' });
  await loc.validate('first_name', '0123');
  expect(loc.errors.first('first_name')).toBe('first_name is alphabetic.');

  loc.localize('ar');
  await loc.validate('first_name', '0123');
  expect(loc.errors.first('first_name')).toBe('first_name يجب ان يحتوي على حروف فقط.');

  loc.localize('ar', { messages: { alpha: () => 'My name is jeff' } });
  await loc.validate('first_name', '0123');
  expect(loc.errors.first('first_name')).toBe('My name is jeff');
});

test('sets locale for all validators', async () => {
  const v1 = new Validator({ first_name: 'alpha' });
  const v2 = new Validator({ first_name: 'alpha' });
  Validator.localize({
    ar: { messages: { alpha: () => 'عايز حروف' } },
    en: { messages: { alpha: () => 'is alphabetic' } }
  });

  v1.locale = 'ar';
  await v1.validate('first_name', '213');
  expect(v1.errors.first('first_name')).toBe('عايز حروف');

  await v2.validate('first_name', '213');
  expect(v2.errors.first('first_name')).toBe('عايز حروف');

  // doesn't matter which instance sets the locale.
  v2.localize('en');
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
});

test('correctly parses rules with multiple colons', async () => {
  const v = new Validator({ time: 'date_format:HH:mm' });
  expect(await v.validate('time', '15:30')).toBe(true);
  expect(await v.validate('time', '1700')).toBe(false);
});

test('can add custom names via the attributes dictionary', async () => {
  const v = new Validator({
    email: 'required|email'
  });

  v.localize('en', {
    attributes: {
      email: 'Email Address'
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
  document.body.innerHTML = `<input type="text" name="birthday_min" value="" id="el">`;
  const el = document.querySelector('#el');
  const v = new Validator();
  v.attach({
    name: 'birthday',
    vm: {
      $el: document.body,
      $refs: {
        birthday_min: el
      }
    },
    rules: 'date_format:DD-MM-YYYY|after:birthday_min'
  });
  v.localize('en', {
    attributes: {
      birthday: 'Birthday',
      birthday_min: 'Some Date'
    }
  });

  el.value = '12-09-2017';
  await v.validate('birthday', '11-09-2017');
  expect(v.errors.first('birthday')).toBe('The Birthday must be after Some Date.');
});

test('rules can return objects to provide context to the error message', async () => {
  const v = new Validator();
  v.extend('reason', {
    getMessage (field, params, data) {
      return data;
    },
    validate (value, params) {
      return {
        valid: false,
        data: 'Not correct'
      };
    }
  });

  v.attach({ name: 'field', rules: 'reason' });
  expect(await v.validate('field', 'wow')).toBe(false);
  expect(v.errors.first('field')).toBe('Not correct');
});

test('rules can return a promise that resolves to an object to provide context to the error message', async () => {
  const v = new Validator();

  v.extend('reason_test_promise', {
    getMessage (field, params, data) {
      return (data && data.message) || 'Something went wrong';
    },
    validate (value) {
      return new Promise(resolve => {
        resolve({
          valid: value === 'trigger' ? false : !! value,
          data: value !== 'trigger' ? undefined : {
            message: 'Not this value'
          }
        });
      });
    }
  });

  v.attach({ name: 'reason_field', rules: 'reason_test_promise' });
  expect(await v.validate('reason_field', 'trigger')).toBe(false);
  expect(v.errors.first('reason_field')).toBe('Not this value');
  expect(await v.validate('reason_field', false)).toBe(false);
  expect(v.errors.first('reason_field')).toBe('Something went wrong');
});

test('can remove rules from the list of validators', async () => {
  Validator.extend('dummy', (value) => !! value);
  const v1 = new Validator({ name: 'dummy' });
  await v1.validate('name', false);

  v1.remove('dummy');
  await expect(v1.validate('name', false)).rejects.toBeTruthy();
});

test('calling validate without args will trigger validateScopes', async () => {
  const v = new Validator();
  v.validateScopes = jest.fn(async () => {});

  await v.validate();
  expect(v.validateScopes).toHaveBeenCalled();
});

test('calling validate with * will trigger validateAll', async () => {
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

test('caliing validateAll with array should validate only matching name', async () => {
  const v = new Validator();
  v.attach({ name: 'name', rules: 'required', getter: () => '123' });
  v.attach({ name: 'lname', rules: 'required|alpha', getter: () => 'AAA' });
  v.attach({ name: 'age', rules: 'required', getter: () => '' });
  expect(await v.validateAll(['name', 'lname'])).toBe(true);
  expect(await v.validateAll(['name', 'age'])).toBe(false);
});

test('can fetch the values using getters when not specifying values in validateAll', async () => {
  const v = new Validator();
  let toggle = true;
  const getter = () => {
    return toggle ? 'valid' : '123';
  };

  v.attach({ name: 'name', rules: 'required|alpha', getter });

  expect(await v.validateAll()).toBe(true);
  toggle = !toggle;
  expect(await v.validateAll()).toBe(false);
});

test('can fetch the values using getters for a specific scope when not specifying values in validateAll', async () => {
  const v1 = new Validator();
  const getter1 = () => 'martin';
  const getter2 = () => 'invalid value';

  v1.attach({ name: 'name', rules: 'required|alpha', scope: 'scope1', getter: getter1 });
  v1.attach({ name: 'name', rules: 'required|alpha', scope: 'scope2', getter: getter2 });

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
  v.attach({ name: 'example.name', rules: 'required|alpha' });
  expect(await v.validate('example.name', '')).toBe(false);
  expect(await v.validate('example.name', 'ad')).toBe(true);
});

test('validations can be paused and resumed', async () => {
  const v = new Validator();
  v.attach({ name: 'name', rules: 'required' });

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

test('errors will not be added on silent validate', async () => {
  const v = new Validator({
    name: 'alpha|min:3'
  }, { fastExit: false });
  expect(await v.validate('name', '2', { silent: true })).toBe(false);
  expect(v.errors.count()).toBe(0);
});

test('errors will not be removed on silent validate', async () => {
  const v = new Validator({
    name: 'alpha|min:3'
  }, { fastExit: false });
  expect(await v.validate('name', '2', { silent: false })).toBe(false);
  expect(await v.validate('name', '2', { silent: true })).toBe(false);
  expect(v.errors.count()).toBe(2);
});

test('flags will not be modified on silent validate', async () => {
  const v = new Validator({}, { fastExit: false });
  const field = v.attach({ name: 'name', rules: 'alpha|min:3' });
  expect(field.flags.pending).toBe(false);
  expect(field.flags.validated).toBe(false);
  expect(await v.validate('name', '2', { silent: true })).toBe(false);
  expect(field.flags.pending).toBe(false);
  expect(field.flags.validated).toBe(false);
});

test('errors will not be added on silent validateScopes', async () => {
  const v = new Validator({}, { fastExit: false });
  v.attach({ name: 'field', rules: 'alpha|min:3', getter: () => '2' });
  expect(await v.validateScopes({ silent: true })).toBe(false);
  expect(v.errors.count()).toBe(0);
});

test('errors will not be removed on silent validateScopes', async () => {
  const v = new Validator({}, { fastExit: false });
  v.attach({ name: 'field', rules: 'alpha|min:3', getter: () => '2' });
  expect(await v.validateScopes({ silent: false })).toBe(false);
  expect(await v.validateScopes({ silent: true })).toBe(false);
  expect(v.errors.count()).toBe(2);
});

test('flags will not be modified on silent validateScopes', async () => {
  const v = new Validator({}, { fastExit: false });
  const field = v.attach({ name: 'field', rules: 'alpha|min:3', getter: () => '2' });
  expect(field.flags.pending).toBe(false);
  expect(field.flags.validated).toBe(false);
  expect(await v.validateScopes({ silent: true })).toBe(false);
  expect(field.flags.pending).toBe(false);
  expect(field.flags.validated).toBe(false);
});

test('errors will not be added on silent validateAll', async () => {
  const v = new Validator({}, { fastExit: false });
  v.attach({ name: 'field', rules: 'alpha|min:3', getter: () => '2' });
  expect(await v.validateAll(null, { silent: true })).toBe(false);
  expect(v.errors.count()).toBe(0);
});

test('errors will not be removed on silent validateAll', async () => {
  const v = new Validator({}, { fastExit: false });
  v.attach({ name: 'field', rules: 'alpha|min:3', getter: () => '2' });
  expect(await v.validateAll(null, { silent: false })).toBe(false);
  expect(await v.validateAll(null, { silent: true })).toBe(false);
  expect(v.errors.count()).toBe(2);
});

test('flags will not be modified on silent validateAll', async () => {
  const v = new Validator({}, { fastExit: false });
  const field = v.attach({ name: 'field', rules: 'alpha|min:3', getter: () => '2' });
  expect(field.flags.pending).toBe(false);
  expect(field.flags.validated).toBe(false);
  expect(await v.validateAll(null, { silent: true })).toBe(false);
  expect(field.flags.pending).toBe(false);
  expect(field.flags.validated).toBe(false);
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
  let field = v.attach({ name: 'name', rules: 'alpha' });
  expect(field.flags.untouched).toBe(true);

  v.flag('name', { untouched: false });
  expect(field.flags.untouched).toBe(false);

  // scoped fields
  v.attach({ name: 'email', rules: 'email', scope: 'myscope' });
  expect(v.flags.$myscope.email.untouched).toBe(true);
  v.flag('myscope.email', { untouched: false });
  expect(v.flags.$myscope.email.untouched).toBe(false);

  // dotted name fields
  field = v.attach({ name: 'form.title', rules: 'alpha' });
  expect(field.flags.untouched).toBe(true);
  v.flag('form.title', { untouched: false });
  expect(field.flags.untouched).toBe(false);

  // non-existant flags fails silently
  expect(() => {
    v.flag('crap', { untouched: false });
  }).not.toThrow();

  // calls update classes.
  field = v.attach(new Field({
    el: document.createElement('input'),
    name: 'somefield',
    rules: 'alpha',
    classes: true
  }));
  field.updateClasses = jest.fn();

  v.flag('somefield', { dirty: true });
  expect(field.updateClasses).toHaveBeenCalled();
});

test('resets fields matching the matcher options', async () => {
  const v = new Validator();
  v.attach({ name: 'field' });
  v.attach({ name: 'fieldTwo', scope: 's1' });
  v.attach({ name: 'fieldThree', scope: 's1' });

  v.errors.add({ field: 'field', msg: 'oops' });
  v.errors.add({ field: 'fieldTwo', msg: 'oops', scope: 's1' });
  v.errors.add({ field: 'fieldThree', msg: 'oops', scope: 's1' });

  await v.reset({ name: 'field' });
  expect(v.errors.count()).toBe(2);
  await v.reset({ scope: 's1' });
  expect(v.errors.count()).toBe(0);
});

test('resets errors scoped by vmId', async () => {
  const v = new Validator();
  v.attach({ name: 'field', vmId: 123 });
  v.attach({ name: 'field', vmId: 456 });

  v.errors.add({ field: 'field', msg: 'oops', vmId: 123 });
  v.errors.add({ field: 'field', msg: 'oops', vmId: 456 });

  await v.reset({ name: 'field', vmId: 123 });
  expect(v.errors.count()).toBe(1);
});

test('resets all fields', async () => {
  const v = new Validator();
  v.attach({ name: 'field' });
  v.attach({ name: 'fieldTwo', scope: 's1' });
  v.attach({ name: 'fieldThree', scope: 's1' });

  v.errors.add({ field: 'field', msg: 'oops' });
  v.errors.add({ field: 'fieldTwo', msg: 'oops', scope: 's1' });
  v.errors.add({ field: 'fieldThree', msg: 'oops', scope: 's1' });

  expect(v.errors.count()).toBe(3);
  await v.reset();
  expect(v.errors.count()).toBe(0);
});

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

test('exposes static locale property', () => {
  expect(typeof Validator.locale).toBe('string');
});

test('exposes static and instance readonly rules properties', () => {
  const v = new Validator();
  expect(typeof v.rules).toBe('object');
  expect(typeof Validator.rules).toBe('object');
});

test('validate can resolve the value if it was not provided', async () => {
  const v = new Validator();
  const field = v.attach({ name: 'field', rules: 'alpha', getter: () => '123' });
  expect(await v.validate(`#${field.id}`)).toBe(false);
});

test('resolves a field by name and scope', async () => {
  const v = new Validator();
  let field = v.attach({ rules: 'alpha', name: 'field', scope: 's1' });
  expect(v._resolveField('field', 's1')).toBe(field);
  field = v.attach({ rules: 'alpha', name: 'field', scope: 0 });
  expect(v._resolveField('field', 0)).toBe(field);
});

test('updates classes after validating a field', async () => {
  const v = new Validator();
  const field = v.attach({ name: 'field', rules: 'alpha', el: document.createElement('input'), classes: true });
  field.updateClasses = jest.fn();
  expect(await v.validate(`#${field.id}`, '123')).toBe(false);
  expect(field.updateClasses).toHaveBeenCalled();
});

test('triggers initial validation for fields', async () => {
  const v = new Validator();
  v.validate = jest.fn();
  const field = v.attach({ name: 'field', rules: 'alpha', el: document.createElement('input'), getter: () => '123', immediate: true });
  await flushPromises();
  expect(v.validate).toHaveBeenCalledWith(`#${field.id}`, '123', { vmId: undefined });
});

test('rules can be skipped on initial validation', async () => {
  const v = new Validator();
  const validateSkip = jest.fn(() => true);
  const validateUnskipped = jest.fn(() => true);

  v.extend('backend', validateSkip, { immediate: false });
  v.extend('backendUnskipped', validateUnskipped);

  v.attach({ name: 'field', rules: 'required|backend|backendUnskipped', el: document.createElement('input'), getter: () => '123' });
  expect(validateSkip).not.toHaveBeenCalled();
  expect(validateUnskipped).toHaveBeenCalled();
});

test('updates classes on related radio input fields', async () => {
  function createRadio (val) {
    const el = document.createElement('input');
    el.name = 'myinput';
    el.type = 'radio';
    el.value = val;

    document.body.appendChild(el);
    return el;
  }
  const v = new Validator();
  const el = createRadio('1');
  const el2 = createRadio('2');
  const el3 = createRadio('3');

  const field = v.attach({ name: 'field', rules: 'required', el, classes: true });
  expect(await v.validate(`#${field.id}`)).toBe(false);
  expect(el.classList.contains('invalid')).toBe(true);
  expect(el2.classList.contains('invalid')).toBe(true);
  expect(el3.classList.contains('invalid')).toBe(true);

  el.checked = true;
  expect(await v.validate(`#${field.id}`, '1')).toBe(true);
  expect(el.classList.contains('valid')).toBe(true);
  expect(el2.classList.contains('valid')).toBe(true);
  expect(el3.classList.contains('valid')).toBe(true);
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
  v.attach({ name: 'field', rules: 'many_promise' });
  expect(await v.validate('field', 'sdad')).toBe(true);
});

test('it should pass the after/before inclusion parameters correctly', async () => {
  document.body.innerHTML = `<input type="text" name="field" value="" id="el">`;
  const el = document.querySelector('#el');
  const v = new Validator();
  v.attach({
    name: 'birthday',
    vm: {
      $el: document.body,
      $refs: {
        field: el
      }
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
  el.type = 'checkbox';
  el.name = 'field';
  let val = true;
  const v = new Validator();
  const field = v.attach({
    el,
    rules: 'required',
    getter: () => {
      return val;
    }
  });
  expect(await v.validate(`#${field.id}`)).toBe(true);
  val = false;
  expect(await v.validate(`#${field.id}`)).toBe(false);

  el.type = 'text'; // checboxes accept false as a value.
  expect(await v.validate(`#${field.id}`)).toBe(true);
});

test('localize api', () => {
  const v = new Validator();

  // sets and updates the dictionary.
  Validator.localize('ar', {
    messages: {
      hey: 'there'
    }
  });

  expect(v.dictionary.container.ar.messages.hey).toBe('there');

  Validator.localize('en');
  expect(v.locale).toBe('en');

  v.localize('ar');
  expect(v.locale).toBe('ar');
});

test('updates existing field errors and flags to match the new scope', async () => {
  const v = new Validator();
  let field = v.attach({ name: 'email', rules: 'required|email' });
  expect(v.flags.email).toBeTruthy();
  await v.validate('email', 'someinvalid');
  expect(v.errors.first('email')).toBeTruthy();

  // changed scope.
  v.update(field.id, { scope: 'myscope' });

  field.scope = 'myscope';
  // test removal
  expect(v.errors.first('email')).toBeFalsy();
  expect(v.flags.email).toBeFalsy();

  // test flag and errors updates.
  expect(v.flags.$myscope.email).toBeTruthy();
  expect(v.errors.first('myscope.email')).toBeTruthy();

  // test scoped fields.
  field = v.attach({ name: 'email', rules: 'required|email', scope: 's1' });
  expect(v.flags.$s1.email).toBeTruthy();
  await v.validate('s1.email', 'someinvalid');
  expect(v.errors.first('s1.email')).toBeTruthy();

  // changed scope.
  v.update(field.id, { scope: 's2' });

  field.scope = 's2';
  // test removal
  expect(v.flags.$s1).toBeFalsy();

  // test flag and errors updates.
  expect(v.flags.$s2.email).toBeTruthy();
  expect(v.errors.first('s2.email')).toBeTruthy();
});

test('removes target based rules from the internal collection', async () => {
  const v = new Validator();
  const rule = (val) => !!val;
  v.extend('rule', rule, { hasTarget: true });
  expect(Validator.isTargetRule('rule')).toBe(true);

  v.remove('rule');
  expect(Validator.isTargetRule('rule')).toBe(false);
});

test('creates regeneratable messages', async () => {
  const v = new Validator();
  v.attach({ name: 'email', rules: 'required|email' });

  await v.validate('email', null);
  const error = v.errors.items[0];
  expect(error.regenerate()).toBe(error.msg);
});

describe('Verify API', () => {
  test('passing values and results', async () => {
    const v = new Validator();
    expect(await v.verify('test', 'max:3')).toEqual({ 'errors': ['The {field} field may not be greater than 3 characters.'], 'valid': false });
    expect(v.errors.count()).toBe(0); // Errors not added.
    expect(await v.verify('tst', 'max:3')).toEqual({ valid: true, errors: [] });
    // test required rule
    expect(await v.verify('', 'required')).toEqual({ 'errors': ['The {field} field is required.'], 'valid': false });
    // test #1353
    expect(await v.verify('föö@bar.de', { email: { allow_utf8_local_part: true } })).toEqual({ valid: true, errors: [] });
    expect(await v.verify('föö@bar.de', { email: { allow_utf8_local_part: false } })).toEqual({ valid: false, errors: ['The {field} field must be a valid email.'] });
  });

  test('target rules validation using options.values', async () => {
    const v = new Validator();
    let result = await v.verify('test', 'confirmed:pass', {
      values: {
        pass: 'tes'
      }
    });
    expect(result.valid).toBe(false);
    result = await v.verify('test', 'confirmed:pass', {
      values: {
        pass: 'test'
      }
    });
    expect(result.valid).toBe(true);
  });

  test('bailing using options.bail', async () => {
    const v = new Validator();
    let { errors } = await v.verify('', 'required|min:3', {
      bails: false
    });
    expect(errors).toHaveLength(2);
    expect(errors).toEqual([
      'The {field} field is required.',
      'The {field} field must be at least 3 characters.'
    ]);
  });

  test('customize field name using options.name', async () => {
    const v = new Validator();
    const { errors } = await v.verify('', 'required', { name: 'username' });
    expect(errors).toEqual(['The username field is required.']);
  });
});

test('maps rules params array to an object', async () => {
  const v = new Validator();

  expect((await v.verify('11.222', 'decimal:2')).valid).toBe(false);
  expect((await v.verify('11.222', { decimal: { decimals: 2 } })).valid).toBe(false);
});
