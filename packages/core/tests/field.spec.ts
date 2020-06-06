import flushPromises from 'flush-promises';
import { defineRule } from '@vee-validate/core';
import { mountWithHoc, setValue, dispatchEvent } from './helpers';

jest.useFakeTimers();

describe('<Field />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  defineRule('required', value => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });

  defineRule('email', email => {
    return email === 'email' ? true : 'The field must be a valid email';
  });

  defineRule('min', (value, [min]: any) => {
    return value && value.length >= min ? true : 'This field must be at least 3 characters';
  });

  // FIXME: typing here should be more lax
  defineRule('confirmed', (value, [target]: any) => {
    return value === target ? true : 'inputs do not match';
  });

  test('renders the as prop', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" as="input" />
    `,
    });

    expect(wrapper.$el.outerHTML).toBe(`<input name="field">`);
  });

  test('listens for input and blur events to set meta flags', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ errors, field, meta }">
          <input v-bind="field" type="text">
          <pre id="pre">{{ meta }}</pre>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const pre = wrapper.$el.querySelector('pre');

    expect(pre.textContent).toContain('"untouched": true');
    expect(pre.textContent).toContain('"pristine": true');
    dispatchEvent(input, 'blur');
    await flushPromises();
    expect(pre.textContent).toContain('"touched": true');
    expect(pre.textContent).toContain('"untouched": false');
    expect(pre.textContent).toContain('"pristine": true');
    dispatchEvent(input, 'input');
    await flushPromises();
    // eslint-disable-next-line jest/valid-expect
    expect(pre.textContent).toContain('"pristine": false');
    expect(pre.textContent).toContain('"dirty": true');
  });

  test('listens for change events', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form" v-slot="{ errors }">
        <Field name="select" as="select" rules="required">
          <option value="">0</option>
          <option value="1">1</option>
        </Field>
        <span id="error">{{ errors.select }}</span>
      </VForm>
    `,
    });

    const select = wrapper.$el.querySelector('select');
    const error = wrapper.$el.querySelector('#error');

    setValue(select, '');
    await flushPromises();
    // validation triggered on change.
    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    setValue(select, '1');
    await flushPromises();

    expect(error.textContent).toBe('');
  });

  test('validates initially with immediate prop', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" immediate rules="required" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');

    // flush the pending validation.
    await flushPromises();

    expect(error.textContent).toContain(REQUIRED_MESSAGE);
  });

  test('watches rules and re-validates', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: { required: true },
        };
      },
      template: `
        <div>
          <Field name="field" :rules="rules" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('#error');
    setValue(input, '1');
    // flush the pending validation.
    await flushPromises();

    expect(error.textContent).toBe('');

    (wrapper as any).rules = {
      required: false,
      min: 3,
    };

    await flushPromises();
    expect(error.textContent).toBe('This field must be at least 3 characters');
  });

  test('validates custom components', async () => {
    const wrapper = mountWithHoc({
      components: {
        TextInput: {
          props: ['value'],
          template: `
            <div>
              <input id="input" :value="value" @input="$emit('input', $event.target.value)">
            </div>
          `,
        },
      },
      template: `
        <div>
          <Field name="field" rules="required" v-slot="{ field, errors }">
            <TextInput ref="input" v-bind="field" />
            <span id="error">{{ errors && errors[0] }}</span>
          </Field>
        </div>
      `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('#input');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    setValue(input, 'val');
    await flushPromises();
    expect(error.textContent).toBe('');
  });

  test('validates target fields using targeted params', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form">
        <Field rules="required" name="confirmation" as="input" />

        <Field name="password" rules="required|confirmed:@confirmation" v-slot="{ field, errors }">
          <input type="password" v-bind="field">
          <span id="err">{{ errors[0] }}</span>
        </Field>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');

    expect(error.textContent).toBeFalsy();
    setValue(inputs[0], 'val');
    await flushPromises();
    // the password input hasn't changed yet.
    expect(error.textContent).toBeFalsy();
    setValue(inputs[1], '12');
    await flushPromises();
    // the password input was interacted with and should be validated.
    expect(error.textContent).toBeTruthy();

    setValue(inputs[1], 'val');
    await flushPromises();
    // the password input now matches the confirmation.
    expect(error.textContent).toBeFalsy();

    setValue(inputs[0], 'val1');
    await flushPromises();
    expect(error.textContent).toBeTruthy();
  });

  test('validates file input', async () => {
    // FIXME: typing here should be more lax
    defineRule('atLeastOne', files => {
      return files && files.length >= 1;
    });

    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field rules="required|atLeastOne" v-slot="{ field, errors }">
          <input type="file" v-bind="field">
          <p id="error">{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    dispatchEvent(input, 'change');
    await flushPromises();

    const error = wrapper.$el.querySelector('#error');
    expect(error.textContent).toBeTruthy();
  });

  test('setting bails prop to false disables exit on first error', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field :bails="false" name="field" rules="email|min:3" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <p v-for="error in errors">{{ error }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    setValue(input, '1');
    await flushPromises();

    const errors = wrapper.$el.querySelectorAll('p');
    expect(errors).toHaveLength(2);
    expect(errors[0].textContent).toBe('The field must be a valid email');
    expect(errors[1].textContent).toBe('This field must be at least 3 characters');
  });

  test('validation can be debounced', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" :debounce="50" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <p>{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('p');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe('');
    await jest.advanceTimersByTime(50);
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('avoids race conditions between successive validations', async () => {
    // A decreasing timeout (the most recent validation will finish before new ones).
    defineRule('longRunning', value => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(value === 42 ? true : 'No Life');
        }, 20);
      });
    });

    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required|longRunning" :debounce="10" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <p>{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('p');

    setValue(input, '123');
    setValue(input, '12');
    setValue(input, '');
    jest.advanceTimersByTime(100);
    await flushPromises();
    // LAST message should be the required one.
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('resets validation state using reset method in slot scope data', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ field, errors, reset }">
          <input type="text" v-bind="field">
          <span id="error">{{ errors && errors[0] }}</span>
          <button @click="reset">Reset</button>
        </Field>
      </div>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(error.textContent).toBe('');
  });
});
