import Vue from 'vue/dist/vue';
import makeMixin from '../src/mixin';
import ErrorBag from '../src/errorBag';
import FieldBag from '../src/fieldBag';
import Validator from '../src/validator';

test('injects an errorBag instance', () => {
  const mixin = makeMixin(Vue);
  const VM = Vue.extend({ mixins: [mixin] });
  const app = new VM();
  expect(app.errors instanceof ErrorBag).toBe(true);
});

test('injects the flags collection', () => {
  const mixin = makeMixin(Vue);
  const VM = Vue.extend({ mixins: [mixin] });
  const app = new VM();
  expect(typeof app.fields === 'object').toBe(true);
});

test('injects a validator instance', () => {
  const mixin = makeMixin(Vue);
  const VM = Vue.extend({ mixins: [mixin] });
  const app = new VM();
  expect(app.$validator instanceof Validator).toBe(true);
});

describe('provides validator instances using provide/inject API', () => {
  test('when auto inject is disabled', () => {
    const mixin = makeMixin(Vue, { inject: false });
    const Child = Vue.extend({
      mixins: [mixin],
      name: 'child',
      template: `<div></div>`,
      inject: ['$validator']
    });
    const OtherChild = Vue.extend({
      mixins: [mixin],
      name: 'other-child',
      template: `<div></div>`,
      inject: { $validator: '$validator' }
    });
    const ThirdChild = Vue.extend({
      mixins: [mixin],
      name: 'third-child',
      template: `<div></div>`
    });
     // does no inject the validator.
    const FourthChild = Vue.extend({
      mixins: [mixin],
      name: 'fourth-child',
      template: `<div></div>`,
      inject: []
    });
    const VM = Vue.extend({
      mixins: [mixin],
      components: { Child, OtherChild, ThirdChild, FourthChild },
      template: `
        <div>
          <child></child>
          <other-child></other-child>
          <third-child></third-child>
          <fourth-child></fourth-child>
        </div>
      `
    });

    const app = new VM().$mount();
    expect(app.$validator).toBe(app.$children[0].$validator);
    expect(app.$validator).toBe(app.$children[1].$validator);
    expect(app.$children[2].$validator).toBe(undefined);
  });
  test('when auto inject is enabled', () => {
    const mixin = makeMixin(Vue, { inject: true });
    const Child = Vue.extend({
      mixins: [mixin],
      name: 'child',
      template: `<div></div>`
    });
    const OtherChild = Vue.extend({
      mixins: [mixin],
      name: 'other-child',
      template: `<div></div>`,
      inject: ['$validator'],
      computed: {
        somval() { return 1 ;}
      }
    });
    const VM = Vue.extend({
      mixins: [mixin],
      components: { Child, OtherChild },
      template: `
        <div>
          <child></child>
          <other-child></other-child>
        </div>
      `
    });

    const app = new VM().$mount();
    expect(app.$validator).not.toBe(app.$children[0].$validator); // got a different instance.
    expect(app.$validator).toBe(app.$children[1].$validator); // got the parent's
  });
});

test('component pauses the validator before destroy if it owns it', () => {
  const mixin = makeMixin(Vue);
  const VM = Vue.extend({ mixins: [mixin] });
  let app = new VM();
  const validator = app.$validator;
  validator.pause = jest.fn();
  app.$destroy();
  expect(validator.pause).toHaveBeenCalledTimes(1);
  validator.resume();
  // does not pause because it does not own the validator.
  app = new VM();
  app.$destroy();
  expect(validator.pause).toHaveBeenCalledTimes(1);
});
