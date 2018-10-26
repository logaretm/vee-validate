import { createLocalVue } from '@vue/test-utils';
import Validator from '@/core/validator';
import VeeValidate from '@/plugin';
import Decorator from '@/core/validatorDecorator';

const Vue = createLocalVue();

VeeValidate.install(Vue);

test('decorates validateAll()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  base.validateAll = jest.fn();
  const v = new Decorator(base, vm);

  v.attach({
    name: 'name'
  });

  v.validateAll();
  expect(base.validateAll).toHaveBeenCalled();
});

test('decorates validateScopes()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  base.validateScopes = jest.fn();
  const v = new Decorator(base, vm);

  v.attach({
    name: 'name'
  });

  v.validateScopes();
  expect(base.validateScopes).toHaveBeenCalled();
});

test('decorates reset()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  base.reset = jest.fn();
  const v = new Decorator(base, vm);

  v.attach({
    name: 'field'
  });

  v.reset();
  expect(base.reset).toHaveBeenCalledWith({ vmId: v.id });

  v.reset({ name: 'field' });
  expect(base.reset).toHaveBeenCalledWith({ vmId: v.id, name: 'field' });
});

test('decorates flag()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  base.flag = jest.fn();
  const v = new Decorator(base, vm);

  v.attach({
    name: 'field'
  });

  v.flag('name', { valid: false });
  expect(base.flag).toHaveBeenCalledWith('name', { valid: false }, 0);
});

test('calls extend()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  const v = new Decorator(base, vm);

  base.extend = jest.fn();
  const validator = () => {};
  v.extend('rule', validator);

  expect(base.extend).toHaveBeenCalledWith('rule', validator);
});

test('calls localize()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  base.localize = jest.fn();
  const v = new Decorator(base, vm);
  v.localize('en');

  expect(base.localize).toHaveBeenCalledWith('en');
});

test('calls remove()', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  base.remove = jest.fn();
  const v = new Decorator(base, vm);
  v.remove('rule');

  expect(base.remove).toHaveBeenCalledWith('rule');
});

test('fields are scoped to the specific component id', () => {
  const base = new Validator();
  const v1 = new Decorator(base, { _uid: 0 });
  const v2 = new Decorator(base, { _uid: 1 });

  v1.attach({ name: 'name' });
  v2.attach({ name: 'email' });
  v2.attach({ name: 'field', scope: 'scope' });

  expect(base.fields.items).toHaveLength(3);
  expect(v1.fields.items).toHaveLength(1);
  expect(v2.fields.items).toHaveLength(2);

  expect(v1.flags.email).toBe(undefined);
  expect(v1.flags.$scope).toBe(undefined);
  expect(v1.flags.name).toBeTruthy();
  expect(v2.flags.name).toBe(undefined);
  expect(v2.flags.email).toBeTruthy();
  expect(v2.flags.$scope.field).toBeTruthy();

  expect(base.flags.email).toBeTruthy();
  expect(base.flags.name).toBeTruthy();
  expect(base.flags.$scope.field).toBeTruthy();
});

test('dictionary getter', () => {
  const base = new Validator();
  const v1 = new Decorator(base, { _uid: 0 });

  expect(v1.dictionary).toBe(base.dictionary);
});

test('locale getter', () => {
  const base = new Validator();
  const v1 = new Decorator(base, { _uid: 0 });

  expect(v1.locale).toBe(base.locale);
});

test('locale setter', () => {
  const base = new Validator();
  const v1 = new Decorator(base, { _uid: 0 });
  v1.locale = 'ar';
  expect(base.locale).toBe('ar');
});

test('rules getter', () => {
  const base = new Validator();
  const v1 = new Decorator(base, { _uid: 0 });

  expect(v1.rules).toBe(base.rules);
});

test('pauses and resumes', () => {
  const base = new Validator();
  const v1 = new Decorator(base, { _uid: 0 });

  v1.pause();
  expect(v1._paused).toBe(true);
  v1.resume();
  expect(v1._paused).toBe(false);
});

test('removes base instance when destroyed', () => {
  const vm = { _uid: 0 };
  const base = new Validator();
  const v = new Decorator(base, vm);

  v.destroy();
  expect(v._base).toBe(undefined);
  expect(v.id).toBe(undefined);
});
