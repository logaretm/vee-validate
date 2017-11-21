import Vue from 'vue/dist/vue';
import { mount, createLocalVue } from 'vue-test-utils';
import ChildComponent from './components/Child';
import mixin from '../src/mixin';
import directive from '../src/directive';
import ErrorBag from '../src/core/errorBag';
import FieldBag from '../src/core/fieldBag';
import Config from '../src/config';
import plugin from './../src/index';

const Validator = plugin.Validator;

test('injects an errorBag instance', () => {
  const VM = Vue.extend({ mixins: [mixin] });
  const app = new VM();
  expect(app.errors instanceof ErrorBag).toBe(true);
});

test('injects the flags collection', () => {
  const VM = Vue.extend({ mixins: [mixin] });
  const app = new VM();
  expect(typeof app.fields === 'object').toBe(true);
});

test('injects a validator instance', () => {
  const VM = Vue.extend({ mixins: [mixin] });
  const app = new VM();
  expect(app.$validator instanceof Validator).toBe(true);
});

describe('provides validator instances using provide/inject API', () => {
  test('when auto inject is disabled', () => {
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
      $_veeValidate: {
        inject: false
      },
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
      $_veeValidate: {
        inject: false
      },
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

describe('components can have a definition object in the ctor options', () => {
  const createVM = () => {
    const Child = Vue.extend({
      mixins: [mixin],
      name: 'child',
      template: `<div></div>`,
      data: () => ({
        innerValue: '102'
      }),
      props: {
        name: String 
      },
      inject: ['$validator'],
      $_veeValidate: {
        rejectsFalse: true,
        value: function () {
          return this.innerValue;
        },
        name: function () {
          return this.name
        },
        events: 'blur'
      }
    });

    return Vue.extend({
      $_veeValidate: {
        inject: false
      },
      mixins: [mixin],
      directives: {
        validate: directive
      },
      components: { Child },
      template: `
        <div>
          <child v-validate="'required'" name="field"></child>
        </div>
      `
    });
  };

  test('uses the value getter in the definition', () => {
    const VM = createVM();

    const app = new VM().$mount();
    const child = app.$children[0];
    const field = app.$validator.fields.items[0];

    // test value resolution.
    expect(field.value).toBe('102');
    child.innerValue = 20;
    expect(field.value).toBe(20);
  });

  test('uses the name getter in the definition', () => {
    const VM = createVM();

    const app = new VM().$mount();
    const field = app.$validator.fields.items[0];
    expect(field.name).toBe('field');
  });

  test('uses the events defined in the definition', () => {
    const VM = createVM();

    const app = new VM().$mount();
    const field = app.$validator.fields.items[0];
    expect(field.events).toEqual(['blur']);
    expect(field.watchers).toHaveLength(3); // blur (flags), input (flags), blur (validate)
  });

  test('components can reject the false value if provided in the required rule', async () => {
    const VM = createVM();

    const app = new VM().$mount();
    const child = app.$children[0];

    expect(await app.$validator.validate('field')).toBe(true);
    child.innerValue = false;

    expect(await app.$validator.validate('field')).toBe(false);
  });

  test('Creates a new instance when the validator option is set to new', () => {
    const Child = Vue.extend({
      mixins: [mixin],
      name: 'child',
      template: `<div></div>`,
      $_veeValidate: {
        validator: 'new'
      }
    });
    const OtherChild = Vue.extend({
      mixins: [mixin],
      name: 'other-child',
      template: `<div></div>`,
      inject: ['$validator'],
      computed: {
        somval() { return 1 ;}
      },
      $_veeValidate: {
        validator: 'inherit'
      }
    });
    const VM = Vue.extend({
      $_veeValidate: {
        inject: false
      },
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

test('built in components should not provide a validator', async () => {
  const localVue = createLocalVue();
  localVue.mixin(mixin);
  const wrapper = mount({
    components: { ChildComponent },
    template: `
      <div>
        <keep-alive>
          <child />
        </keep-alive>
        <transition>
          <child />
        </transition>
      </div>
    `
  }, { localVue });

  const $validator = wrapper.vm.$validator;
  const children = wrapper.findAll(ChildComponent);
  for (let i = 0; i < children.length; i++) {
    expect(children.at(i).vm.$validator).toBe($validator);
  }
});