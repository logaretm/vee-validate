import flushPromises from 'flush-promises';
import { defineRule, ErrorMessage } from '@vee-validate/core';
import { mountWithHoc, setValue } from './helpers';

describe('<ErrorMessage />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  defineRule('required', value => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });

  test('shows error messages for a field', async () => {
    const wrapper = mountWithHoc({
      components: {
        ErrorMessage,
      },
      template: `
      <VForm>
        <Field name="field" rules="required" as="input" />
        <ErrorMessage name="field" id="error" />
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    expect(error.tagName).toBe('SPAN');
    const input = wrapper.$el.querySelector('input');
    await flushPromises();
    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    setValue(input, '12');
    await flushPromises();

    expect(error.textContent).toBe('');
  });

  test('render with "as" prop', async () => {
    const wrapper = mountWithHoc({
      components: {
        ErrorMessage,
      },
      template: `
      <VForm as="form">
        <Field name="field" rules="required" as="input" />
        <ErrorMessage as="div" name="field" id="error" />

        <button>Validate</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');

    expect(error.tagName).toBe('DIV');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('render with "as" prop and child nodes', async () => {
    const wrapper = mountWithHoc({
      components: {
        ErrorMessage,
      },
      template: `
      <VForm as="form">
        <Field name="field" rules="required" as="input" />
        <ErrorMessage as="div" name="field" id="error" v-slot="{ message }">
          <span>icon</span>
          <span>{{ message }}</span>
        </ErrorMessage>

        <button>Validate</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');

    expect(error.tagName).toBe('DIV');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(error.textContent).toContain(REQUIRED_MESSAGE);
  });

  test('render with scoped slots', async () => {
    const wrapper = mountWithHoc({
      components: {
        ErrorMessage,
      },
      template: `
      <VForm as="form">
        <Field name="field" rules="required" as="input" />
        <ErrorMessage name="field" v-slot="{ message }">
          <p id="error">{{ message }}</p>
        </ErrorMessage>

        <button>Validate</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    expect(error.tagName).toBe('P');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);
  });
});
