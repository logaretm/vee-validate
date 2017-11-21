import Field from '../src/core/field';

test('constructs a headless field with default values', () => {
  const field = new Field(null, {});

  expect(field.id).toBeTruthy(); // has been id'ed.
  expect(field.scope).toBe(null);
  expect(field.name).toBe(null);
  expect(field.classes).toBe(false);
  expect(field.rules).toEqual({});
  expect(field.events).toEqual(['input', 'blur']);
  expect(field.watchers.length).toBe(0);
  expect(field.delay).toEqual({'input': 0, 'blur': 0});
  expect(field.flags).toEqual({
    untouched: true,
    touched: false,
    dirty: false,
    pristine: true,
    valid: null,
    invalid: null,
    validated: false,
    pending: false,
    required: false
  });
  expect(field.classNames).toEqual({
    touched: 'touched',
    untouched: 'untouched',
    valid: 'valid',
    invalid: 'invalid',
    pristine: 'pristine',
    dirty: 'dirty'
  });
  expect(field.el).toBeFalsy();
  field.classNames = null; // make sure it resets to the default value.
  field.update({});
  expect(field.classNames).toEqual({
    touched: 'touched',
    untouched: 'untouched',
    valid: 'valid',
    invalid: 'invalid',
    pristine: 'pristine',
    dirty: 'dirty'
  });
});

test('fields can be configured to not add any value listener', () => {
  document.body.innerHTML = `
    <input name="name" id="name">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el, { listen: false });
  expect(field.watchers.length).toBe(2); // just action listeners.
});

test('caches the field id on the element data attributes', () => {
  document.body.innerHTML = `
    <input name="name" id="name">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el);

  // check if id was cached.
  expect(el.getAttribute('data-vv-id')).toBe(field.id);
});

test('it adds value listeners on the native inputs', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el, { getter: () => el.value });

  // two events [input and blur] along with same events for actions.
  expect(field.watchers.length).toBe(4);
  field.addValueListeners(); // Idempotence call.
  expect(field.watchers.length).toBe(4); // still 4

  field.vm = { $validator: { validate: jest.fn() } };

  // test input event.
  el.dispatchEvent(new Event('input'));
  expect(field.validator.validate).toHaveBeenCalledWith(`#${field.id}`, field.value);

  // blur event.
  el.dispatchEvent(new Event('blur'));
  expect(field.validator.validate).toHaveBeenCalledTimes(2);
  expect(field.validator.validate).toHaveBeenLastCalledWith(`#${field.id}`, field.value);

  // test event removal
  field.unwatch(/input/);
  // none are left.
  expect(field.watchers.length).toBe(0);
  el.dispatchEvent(new Event('blur'));

  // has not changed since it was removed.
  expect(field.validator.validate).toHaveBeenCalledTimes(2);
});

test('it adds value listeners on all radio inputs that have the same name', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="1" type="radio">
    <input name="name" value="2" type="radio">
    <input name="name" id="last" value="3" type="radio">
  `;
  const el = document.querySelector('#name');
  const el2 = document.querySelector('#last');
  const field = new Field(el, { getter: () => el.value });
  field.vm = { $validator: { validate: jest.fn() } };
  el2.dispatchEvent(new Event('change'));

  expect(field.validator.validate).toHaveBeenCalledTimes(1); // triggered.
  expect(field.watchers.length).toBe(8); // 4 for each field.
  field.unwatch();
  el2.dispatchEvent(new Event('change'));
  expect(field.watchers.length).toBe(0);
  expect(field.validator.validate).toHaveBeenCalledTimes(1);
});

test('it adds value listeners on the components', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el, {
    component: { $on: jest.fn(), $off: jest.fn() },
    getters: {
      context: () => el,
      value: (ctx) => ctx.value
    }
  });

  // two events [input and blur] with the classes.
  expect(field.watchers.length).toBe(4);
  expect(field.component.$on).toHaveBeenCalledTimes(2);
  field.addValueListeners(); // Idempotence call.
  expect(field.watchers.length).toBe(4); // still 4
});


test('computes the disabled property', () => {
  document.body.innerHTML = `<input name="name" id="name" value="10">`;
  const el = document.querySelector('#name');
  const field = new Field(el);

  expect(field.isDisabled).toBe(false);
  el.disabled = true;
  expect(field.isDisabled).toBe(true);

  field.component = { disabled: true };
  expect(field.isDisabled).toBe(true);
});

describe('computes the display name', () => {
  test('via update method', () => {
    const field = new Field(null, { name: 'email' });
    // no alias was defined.
    expect(field.alias).toBe(null);
    field.update({ alias: 'aliased' });
    expect(field.alias).toBe('aliased');
  });

  test('via the data-vv-as attribute', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" v-model="email" data-vv-as="myAlias">
    `;
    let el = document.querySelector('#el');
    const field = new Field(el);
    expect(field.alias).toBe('myAlias');
  });

  test('via the component $attrs object', () => {
    const component = { $attrs: { 'data-vv-as': 'alias' } };
    const field = new Field(null, { component });
    expect(field.alias).toBe('alias');
  });
});

test('it adds class listeners on the input', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10" type="text">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el, { classes: false });

  // input, blur, focus, and another input.
  expect(field.watchers.length).toBe(4);
  field.addActionListeners(); // Idempotence call.
  expect(field.watchers.length).toBe(4); // still 4

  // if field classes are disabled do not add.
  field.updateClasses();
  expect(el.classList.contains('untouched')).toBe(false);
  expect(el.classList.contains('pristine')).toBe(false);

  field.update({ classes: true });
  expect(el.classList.contains('untouched')).toBe(true);
  expect(el.classList.contains('pristine')).toBe(true);


  // test classes and one shot behavior.
  el.dispatchEvent(new Event('input'));
  expect(field.watchers.length).toBe(3); // 1 event down.
  expect(el.classList.contains('dirty')).toBe(true);
  expect(field.flags.dirty).toBe(true);
  expect(el.classList.contains('pristine')).toBe(false);
  expect(field.flags.pristine).toBe(false);

  el.dispatchEvent(new Event('blur'));
  expect(field.watchers.length).toBe(2); // 1 more down.
  expect(el.classList.contains('untouched')).toBe(false);
  expect(field.flags.untouched).toBe(false);
  expect(el.classList.contains('touched')).toBe(true);
  expect(field.flags.touched).toBe(true);

  // disable the classes after being enabled.
  field.addActionListeners(); // Idempotence call.
  expect(field.watchers.length).toBe(4); // back to 4.
  field.update({ classes: false }); // disable classes.
  expect(field.watchers.length).toBe(4); // they remain because of flags.
});

test('calls validate if it was already validated and if there is a change in rules', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10" type="text">
  `;
  const el = document.querySelector('#name');
  const vm = { $validator: { validate: jest.fn() } };
  const field = new Field(el, { rules: 'required', vm });

  // field is updated but hadn't been validated yet.
  field.update({});
  expect(vm.$validator.validate).toHaveBeenCalledTimes(0);

  // validated but no change in rules.
  field.flags.validated = true;
  field.update({});
  expect(vm.$validator.validate).toHaveBeenCalledTimes(0);

  // change in rules.
  field.update({ rules: 'required|alpha' });
  expect(vm.$validator.validate).toHaveBeenCalledWith(`#${field.id}`);
});

test('it adds class listeners on components', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10" type="text">
  `;
  const component = {
    evts: [],
    $once: jest.fn((evt, cb) => {
      component.evts.push({ evt, cb });
    }),
    $off: jest.fn((evt) => {
      component.evts = component.evts.filter(e => e.evt !== evt);
    }),
    $on: jest.fn(),
    $emit: jest.fn(event => {
      component.evts.forEach(e => e.cb());
    })
  };
  const el = document.querySelector('#name');
  const field = new Field(el, {
    events: '',
    classes: true,
    component,
  });

  expect(field.component.$once).toHaveBeenCalledTimes(2);
  component.$emit('input');
  // first call was to off the input listener.
  expect(field.component.$off.mock.calls[0][0]).toBe('input');

  component.$emit('blur');
  // second call was to off the blur listener.
  expect(field.component.$off.mock.calls[1][0]).toBe('blur');
  expect(field.component.$off).toHaveBeenCalledTimes(2);

  // only once.
  component.$emit('input');
  component.$emit('blur');
  expect(field.component.$off).toHaveBeenCalledTimes(2);

  // no events.
  expect(field.watchers.length).toBe(0);
});

test('it checks against a specified matcher', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10" type="text">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el, { name: 'name' });
  // match by name.
  expect(field.matches({
    name: 'name'
  })).toBe(true);

  // match by scope.
   expect(field.matches({
    scope: null
  })).toBe(true);

  // both
  expect(field.matches({
    scope: null,
    name: 'email'
  })).toBe(false);

  expect(field.matches({
    scope: null,
    name: 'name'
  })).toBe(true);

  // match by id.
  expect(field.matches({
    id: field.id
  })).toBe(true);

  // no matcher.
  expect(field.matches({})).toBe(true);
});

test('uses the watch API instead of adding listeners if the field is bound with a model', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10" type="text">
  `;
  const el = document.querySelector('#name');
  // opt in for only the input event.
  const field = new Field(el, { model: 'email', events: 'input', vm: { $watch: jest.fn() } });

  // one for model, two for user actions.
  expect(field.watchers.length).toBe(3);
  expect(field.watchers[2].tag).toBe('input_model');
  expect(field.vm.$watch).toHaveBeenCalled();
});

test('fields can be destroyed and have all their listeners cleaned up along with their dependencies', () => {
  document.body.innerHTML = `
    <input name="name" id="name" value="10" type="text">
  `;
  const el = document.querySelector('#name');
  const field = new Field(el, { name: 'name', classes: true });
  const destroy = jest.fn();
  field.dependencies.push({ field: { destroy }});
  expect(field.watchers.length).toBe(4);
  field.destroy();
  expect(field.watchers.length).toBe(0);
  expect(destroy).toHaveBeenCalled();
})

test('sets aria attributes on elements', async () => {
  let el = document.createElement('input');
  const field = new Field(el, { rules: 'required' });
  expect(el.getAttribute('aria-required')).toBe('true');
  expect(el.getAttribute('aria-invalid')).toBe('false');

  field.flags.invalid = true;
  field.update({ rules: 'min:3' });
  expect(el.getAttribute('aria-required')).toBe('false');
  expect(el.getAttribute('aria-invalid')).toBe('true');
  field.el = null; // headless
  field.updateAriaAttrs();

  // unchanged.
  expect(el.getAttribute('aria-required')).toBe('false');
  expect(el.getAttribute('aria-invalid')).toBe('true');
});

test('computes the rejectsFalse property', () => {
  let el = document.createElement('input');
  el.type = 'checkbox';
  const vm = {
    $validator: {
      errors: {
        update: jest.fn()
      }
    }
  };
  const component = {
    value: 10,
    events: {},
    $el: document.body.children[0],
    $watch: () => {},
    $on: jest.fn()
  };
  let field = new Field(null);
  expect(field.rejectsFalse).toBe(false);
  field = new Field(null, {
    component,
    vm
  });
  expect(field.rejectsFalse).toBe(false);
  field = new Field(el, { rules: 'required', vm });
  expect(field.rejectsFalse).toBe(true);
});

test('calls the update method on the validator errors when updating scope', () => {
  let el = document.createElement('input');
  const vm = {
    $validator: {
      update: jest.fn()
    }
  };
  const field = new Field(el, { rules: 'required', vm });
  field.updated = true;
  field.update({ rules: 'min:3', scope: 'scope' });
  expect(vm.$validator.update).toHaveBeenCalledTimes(1);
});

test('calls the update method on the validator errors when updating scope to 0', () => {
  let el = document.createElement('input');
  const vm = {
    $validator: {
      update: jest.fn()
    }
  };
  const field = new Field(el, { rules: 'required', vm });
  field.updated = true;
  field.update({ rules: 'min:3', scope: 0 });
  expect(vm.$validator.update).toHaveBeenCalledTimes(1);
});

describe('fields can track their dependencies', () => {
  test('native input depencies', () => {
    document.body.innerHTML = `
      <input name="other" id="name" value="10" type="text">
    `;
    let field = new Field(null, {
      rules: 'required|confirmed:other',
      vm: {
        $el: document.body,
        $validator: { validate: jest.fn() }
      }
    });
    expect(field.dependencies.length).toBe(1);
    expect(field.dependencies[0].name).toBe('confirmed');
    expect(field.dependencies[0].field.value).toBe('10');
    const destroy = jest.fn();
    field.dependencies[0].field.destroy = destroy;
    field.updateDependencies(); // test destroy.

    expect(destroy).toHaveBeenCalled();
  });

  test('component dependencies', () => {
    const component = {
      value: 10,
      $el: document.body.children[0],
      $watch: () => {},
      $on: () => {}
    };

    const field = new Field(null, {
      rules: 'required|confirmed:$other',
      vm: {
        $el: document.body,
        $refs: {
          other: component
        }
      }
    });

    expect(field.dependencies.length).toBe(1);
    expect(field.dependencies[0].name).toBe('confirmed');
    expect(field.dependencies[0].field.value).toBe(10);
  });

  test('skips if no dependency was resolved', () => {
    document.body.innerHTML = ``;
    global.console.warn = jest.fn();
    let field = new Field(null, {
      rules: 'required|confirmed:other',
      vm: {
        $el: document.body
      }
    });

    expect(field.dependencies.length).toBe(0);
  });

  test('validation triggers on the parent/controller field', () => {
    document.body.innerHTML = `
      <input name="other" id="name" value="10" type="text">
    `;
    const el = document.querySelector('#name');
    const field = new Field(null, {
      rules: 'required|confirmed:other',
      vm: {
        $el: document.body,
        $validator: { validate: jest.fn() }
      }
    });

    el.dispatchEvent(new Event('input'));
    expect(field.dependencies[0].field.validator.validate).toHaveBeenCalledWith(`#${field.id}`);
  });

  test('fails silently with invalid selectors', () => {
    document.body.innerHTML = `
      <input name="other" id="name" value="10" type="text">
    `;
    let field = new Field(null, {
      rules: 'required|confirmed:123-123-123',
      vm: {
        $el: document.body,
        $validator: { validate: jest.fn() }
      }
    });
    expect(field.dependencies.length).toBe(0);
  });
});

test('set field custom validity if possible', () => {
  document.body.innerHTML = `
      <input name="other" id="name" value="10" type="text">
    `;
  const el = document.querySelector('#name');
  const field = new Field(null, {
    rules: 'required|confirmed:other',
    vm: {
      $el: document.body,
      $validator: { validate: jest.fn(), errors: { firstById: () => 'Error' } }
    }
  });

  el.setCustomValidity = jest.fn();
  field.flags.valid = false;
  field.flags.invalid = true;

  field.updateCustomValidity();
  expect(el.setCustomValidity).toHaveBeenCalledTimes(0);

  field.el = el;
  field.updateCustomValidity();
  expect(el.setCustomValidity).toHaveBeenCalledTimes(1);

  field.validator.errors.firstById = () => null;
  // check unset.
  field.flags.valid = true;
  field.updateCustomValidity();
  expect(el.setCustomValidity).toHaveBeenLastCalledWith('');

  // Check set with no errors in error bag.
  field.flags.valid = false;
  field.updateCustomValidity();
  expect(el.setCustomValidity).toHaveBeenLastCalledWith('');
});

test('resets field state', () => {
  const el = document.createElement('input');
  el.type = 'text';
  el.name = 'field';
  const vm = {
    $validator: {
      errors: {
        removeById: jest.fn()
      }
    }
  };
  const field = new Field(el, { vm });
  field.flags.valid = true;
  field.el.setAttribute('aria-invalid', 'true');

  field.reset();
  expect(field.flags.valid).toBe(null);
  expect(field.el.getAttribute('aria-invalid')).toBe('false');
});

test('sets the field flags', () => {
  const field = new Field(null);
  field.setFlags({
    valid: false
  });
  expect(field.flags.invalid).toBe(true);
  expect(field.flags.valid).toBe(false);

  // specifiying the negated flag is respected.
  field.setFlags({
    touched: false,
    untouched: false
  });

  expect(field.flags.touched).toBe(false);
  expect(field.flags.untouched).toBe(false);
});

test('field scope set to 0', () => {
  const field = new Field(null, {scope:0});
  expect(field.scope).toBe(0);
});
