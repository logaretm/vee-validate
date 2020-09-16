import flushPromises from 'flush-promises';
import { defineRule, configure } from '@vee-validate/core';
import { mountWithHoc, setValue, dispatchEvent } from './helpers';
import * as yup from 'yup';
import { ref, Ref } from 'vue';

jest.useFakeTimers();

beforeEach(() => {
  configure({
    bails: true,
  });
});

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

  defineRule('confirmedObj', (value, { target }: any) => {
    return value === target ? true : 'inputs do not match';
  });

  test('renders an input by default', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" as="input" />
    `,
    });

    expect(wrapper.$el.tagName).toBe(`INPUT`);
  });

  test('renders the as prop', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" as="div" />
    `,
    });

    expect(wrapper.$el.tagName).toBe(`DIV`);
  });

  test('renderless if no as prop and default slot exists', () => {
    const wrapper = mountWithHoc({
      template: `
      <Field name="field" v-slot="{ field }">
        <select v-bind="field">
          <option>1</option>
        </select>
      </select>
    `,
    });

    expect(wrapper.$el.tagName).toBe(undefined);
  });

  test('accepts functions to be passed as rules', async () => {
    const isRequired = (val: any) => (val ? true : 'Field is required');

    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: isRequired,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ errors, field, meta }">
          <input v-bind="field" type="text">
          <span>{{ errors[0] }}</span>
        </Field>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('span');
    expect(error.textContent).toBe('');
    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe('Field is required');
  });

  test('accepts objects to be passed as rules', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: { required: true, min: [3], confirmedObj: { target: '@other' } },
        };
      },
      template: `
      <VForm as="form">
        <Field name="field" :rules="rules" v-slot="{ errors, field }">
          <input v-bind="field" type="text">
          <span id="fieldError">{{ errors[0] }}</span>
        </Field>
    
        <Field name="other" rules="required" v-slot="{ errors, field }">
          <input v-bind="field" type="text">
          <span>{{ errors[0] }}</span>
        </Field>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('#fieldError');
    expect(error.textContent).toBe('');
    setValue(input, '1');
    await flushPromises();
    expect(error.textContent).toBe('This field must be at least 3 characters');
    setValue(input, '123');
    await flushPromises();
    expect(error.textContent).toBe('inputs do not match');
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
    let rules!: Ref<any>;
    const wrapper = mountWithHoc({
      setup() {
        rules = ref({ required: true });

        return {
          rules,
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

    rules.value = {
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
        <Field name="field" rules="required|atLeastOne" v-slot="{ field, errors }">
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

  test('yup rules can be used', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const rules = yup.string().required().min(8);

        return {
          rules,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ field, errors }">
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
    expect(error.textContent).toBe('this is a required field');
    setValue(input, '12');
    await flushPromises();
    expect(error.textContent).toBe('this must be at least 8 characters');
    setValue(input, '12345678');
    await flushPromises();
    expect(error.textContent).toBe('');
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
        <Field name="field" rules="required|longRunning" v-slot="{ field, errors }">
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

  test('generates aria invalid attribute', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <Field name="field" rules="required" v-slot="{ aria, field }">
          <input type="text" v-bind="{ ...field, ...aria }">
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('false');

    setValue(input, '');
    await flushPromises();

    expect(input.getAttribute('aria-invalid')).toBe('true');

    setValue(input, '1');
    await flushPromises();
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  test('yup abortEarly is set by bails global option', async () => {
    configure({
      bails: false,
    });
    const wrapper = mountWithHoc({
      setup() {
        const rules = yup.string().min(8).url();

        return {
          rules,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ errors, field }">
          <input type="text" v-bind="field">
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('ul');
    const input = wrapper.$el.querySelector('input');
    expect(errors.children).toHaveLength(0);

    setValue(input, '1234');
    await flushPromises();
    expect(errors.children).toHaveLength(2);
  });

  test('yup abortEarly is set by bails prop', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const rules = yup.string().min(8).url();

        return {
          rules,
        };
      },
      template: `
      <div>
        <Field name="field" :rules="rules" v-slot="{ errors, field }" :bails="false">
          <input type="text" v-bind="field">
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('ul');
    const input = wrapper.$el.querySelector('input');
    expect(errors.children).toHaveLength(0);

    setValue(input, '1234');
    await flushPromises();
    expect(errors.children).toHaveLength(2);
  });

  test('is synced with v-model', async () => {
    let inputValue!: Ref<string>;
    const wrapper = mountWithHoc({
      setup() {
        inputValue = ref('');
        return {
          value: inputValue,
        };
      },
      template: `
      <div>
        <Field v-model="value" type="text" name="field" />
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    setValue(input, '1234');
    await flushPromises();
    expect(inputValue.value).toBe('1234');

    inputValue.value = '455';
    await flushPromises();
    expect(input.value).toBe('455');
  });

  test('generateMessage is invoked with custom fn rules', async () => {
    configure({
      generateMessage: ({ field }) => `${field} is bad`,
    });
    const wrapper = mountWithHoc({
      setup() {
        return {
          rules: () => false,
        };
      },
      template: `
      <div>
        <Field :rules="rules" name="field" v-slot="{ field, errors }">
          <input type="text" v-bind="field">
          <p id="error">{{ errors[0] }}</p>
        </Field>
      </div>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('#error');
    setValue(input, '1234');
    await flushPromises();
    expect(error.textContent).toBe('field is bad');
  });
});
