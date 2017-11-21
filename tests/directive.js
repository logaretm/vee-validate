import Vue from 'vue/dist/vue';
import directive from '../src/directive';

test('warns if no validator was found during binding', () => {
  let VM = Vue.extend({
    directives: { validate: directive },
    template: `
      <input v-validate>
    `
  });
  global.console.warn = jest.fn();
  let app = new VM().$mount();
  expect(console.warn).toHaveBeenCalledWith(
    `[vee-validate] No validator instance is present on vm, did you forget to inject '$validator'?`
  );
});

test('adds the field after binding', () => {
  const field = {
    update: jest.fn()
  };
  const $validator = {
    attach: jest.fn(),
    validate: () => {},
    update: () => {},
    fields: {
      find: jest.fn(() => field)
    }
  };
  const VM = Vue.extend({
    directives: { validate: directive },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate>
    `
  });
  global.console.warn = jest.fn();
  const app = new VM().$mount();
  expect(console.warn).toHaveBeenCalledTimes(0); // didn't get called.
  expect($validator.attach).toHaveBeenCalledTimes(1); // field got attached.
  // test inserted hook.
  expect($validator.fields.find).toHaveBeenCalledWith({
    id: app.$el.getAttribute('data-vv-id')
  });
});

test('evaluates field options after update', done => {
  const field = {
    update: jest.fn()
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    validate: () => {},
    update: () => {},
    detach: jest.fn()
  };
  const VM = Vue.extend({
    data: () => ({
      value: ''
    }),
    directives: { validate: directive },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate="'directive'" data-vv-scope="s1" v-model="value">
    `
  });
  const app = new VM().$mount();
  expect(field.update).toHaveBeenCalledTimes(1); // at inserted.
  app.value = 'new'; // trigger update.
  app.$nextTick(() => {
    expect(field.update).toHaveBeenCalledTimes(2); // at update.
    done();
  });
});

test('expression can contain an object containing the scope', done => {
  const field = {
    update: jest.fn(),
    expression: 'unlikeuhaveseen'
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    validate: () => {},
    update: () => {},
    detach: jest.fn()
  };
  const VM = Vue.extend({
    data: () => ({
      value: ''
    }),
    directives: { validate: directive },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate="{ scope: 's1', rules: 'required' }" v-model="value">
    `
  });
  const app = new VM().$mount();
  expect(field.update).toHaveBeenCalledTimes(1); // at inserted.
  app.value = 'new'; // trigger update.
  app.$nextTick(() => {
    expect(field.update).toHaveBeenCalledTimes(2); // at update.
    done();
  });
});

test('cleans up after unbinding', () => {
  const field = {
    update: jest.fn()
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    validate: () => {},
    update: () => {},
    detach: jest.fn()
  };
  const VM = Vue.extend({
    directives: { validate: directive },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate="{ rules: 'required', scope: 's1' }" >
    `
  });
  let app = new VM().$mount();
  expect($validator.attach).toHaveBeenCalledTimes(1); // field got attached.
  app.$destroy();
  expect($validator.detach).toHaveBeenCalledTimes(1); // field got detached.

  $validator.fields.find = jest.fn(() => null); // test field early exit guard
  app = new VM().$mount();
  app.$destroy();
  expect($validator.detach).toHaveBeenCalledTimes(1); // did not get called again.
});

test('revises scope after inserted', async () => {
    const field = {
      updated: false,
      update: jest.fn(() => {
        field.updated = true;
      }),
      scope: null
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    validate: () => {},
    update: () => {},
    detach: jest.fn()
  };
  const VM = Vue.extend({
    data: () => ({
      scope: null,
      value: null
    }),
    directives: { validate: directive },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate="'required'" v-model="value" name="name" :data-vv-scope="scope">
    `
  });
  const app = new VM().$mount();
  app.scope = 'new';
  await app.$nextTick(); // different expression.
  expect(field.update).toHaveBeenCalledTimes(1); // expression changed.

  app.scope = 'other'; 
  await app.$nextTick();
  expect(field.update).toHaveBeenCalledTimes(1); // no meaningful change was detected, so it didn't update.
});