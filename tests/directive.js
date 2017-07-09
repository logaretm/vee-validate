import Vue from 'vue/dist/vue';
import makeDirective from '../src/directive';

test('warns if no validator was found during binding', () => {
  const VM = Vue.extend({
    directives: { validate: makeDirective() },
    template: `
      <input v-validate>
    `
  });
  global.console.warn = jest.fn();
  const app = new VM().$mount();
  expect(console.warn).toHaveBeenCalledWith(
    `[vee-validate] No validator instance is present on un-named component, did you forget to inject '$validator'?`
  );
});

test('adds the field after binding', () => {
  const field = {
    update: jest.fn()
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    }
  };
  const VM = Vue.extend({
    directives: { validate: makeDirective() },
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
    update: jest.fn(),
    expression: 'unlikeuhaveseen'
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    detach: jest.fn()
  };
  const VM = Vue.extend({
    data: () => ({
      value: ''
    }),
    directives: { validate: makeDirective() },
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

test('cleans up after unbinding', () => {
  const field = {
    update: jest.fn()
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    detach: jest.fn()
  };
  const VM = Vue.extend({
    directives: { validate: makeDirective() },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate="{ rules: 'required', scope: 's1' }" >
    `
  });
  const app = new VM().$mount();
  expect($validator.attach).toHaveBeenCalledTimes(1); // field got attached.
  app.$destroy();
  expect($validator.detach).toHaveBeenCalledTimes(1); // field got detached.
});

test('revises scope after inserted', async () => {
    const field = {
    update: jest.fn(opts => {
      field.expression = JSON.stringify(opts.expression);
    }) // does not change expression.
  };
  const $validator = {
    attach: jest.fn(),
    fields: {
      find: jest.fn(() => field)
    },
    detach: jest.fn()
  };
  const VM = Vue.extend({
    data: () => ({
      value: '',
      name: 'some'
    }),
    directives: { validate: makeDirective() },
    beforeCreate() {
      this.$validator = $validator
    },
    template: `
      <input v-validate="value" v-model="value" :name="name">
    `
  });
  const app = new VM().$mount();
  app.value = 'new';
  await app.$nextTick(); // different expression.
  expect(field.update).toHaveBeenCalledTimes(2); // CAUSE EXPRESSION HAS NOT CHANGED.

  app.name = 'other'; 
  await app.$nextTick();
  expect(field.update).toHaveBeenCalledTimes(2); // CAUSE EXPRESSION HAS NOT CHANGED.
});