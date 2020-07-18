import flushPromises from 'flush-promises';
import { defineRule } from '@vee-validate/core';
import { mountWithHoc, setValue } from './helpers';
import * as yup from 'yup';

describe('<Form />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  defineRule('required', value => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });

  test('renders the as prop', () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm as="form" />
      </div>
    `,
    });

    expect(wrapper.$el.innerHTML).toBe(`<form novalidate=""></form>`);
  });

  test('observes the current state of providers', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form" v-slot="{ meta }">
        <Field name="field" rules="required" as="input" type="text" />

        <span id="state">{{ meta.valid }}</span>
      </VForm>
    `,
    });

    const stateSpan = wrapper.$el.querySelector('#state');
    const input = wrapper.$el.querySelector('input');
    setValue(input, '');

    await flushPromises();
    // initially the field valid flag is false.
    expect(stateSpan.textContent).toBe('false');

    setValue(input, 'value');
    await flushPromises();

    expect(stateSpan.textContent).toBe('true');
  });

  test('submit handler only executes if observer is valid', async () => {
    let calls = 0;
    const wrapper = mountWithHoc({
      setup() {
        return {
          submit() {
            calls++;
          },
        };
      },
      template: `
      <VForm @submit="submit" as="form" v-slot="{ errors }">
        <Field name="field" rules="required" as="input" />
        <span id="error">{{ errors.field }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');
    await flushPromises();
    expect(error.textContent).toBe('');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(calls).toBe(0);

    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    setValue(input, '12');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(error.textContent).toBe('');
    expect(calls).toBe(1);
  });

  test('handles reset', async () => {
    let isReset = false;
    const wrapper = mountWithHoc({
      setup() {
        return {
          reset: () => {
            isReset = true;
          },
        };
      },
      template: `
      <VForm @reset="reset" as="form" v-slot="{ errors }">
        <Field rules="required" name="field" as="input"/>
        <span id="error">{{ errors.field }}</span>

        <button id="submit">Validate</button>
        <button id="reset" type="reset">Reset</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    expect(error.textContent).toBe('');

    wrapper.$el.querySelector('#submit').click();
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    wrapper.$el.querySelector('#reset').click();
    await flushPromises();

    expect(error.textContent).toBe('');
    expect(isReset).toBe(true);
  });

  test('disabled fields do not participate in validation', async () => {
    let isInObject = false;
    const wrapper = mountWithHoc({
      setup() {
        return {
          disabled: false,
          submit: (values: Record<string, any>) => {
            isInObject = 'field' in values;
          },
        };
      },
      template: `
      <VForm @submit="submit" as="form">
        <Field rules="required" name="field" as="input" :disabled="disabled"/>

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    setValue(input, '123');
    const button = wrapper.$el.querySelector('#submit');

    button.click();
    await flushPromises();

    expect(isInObject).toBe(true);

    (wrapper as any).disabled = true;
    button.click();
    await flushPromises();

    expect(isInObject).toBe(false);
  });

  test('initial values can be set with initialValues prop', async () => {
    const initialValues = {
      field: 'hello',
    };
    const wrapper = mountWithHoc({
      setup() {
        return {
          initialValues,
        };
      },
      template: `
      <VForm :initialValues="initialValues" @submit="submit" as="form">
        <Field rules="required" name="field" as="input" />

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');

    expect(input.value).toBe(initialValues.field);
  });

  test('having no submit listener will submit the form natively', async () => {
    const submitMock = jest.fn();
    const wrapper = mountWithHoc({
      template: `
      <VForm @submit="submit" as="form" v-slot="{ errors }">
        <Field name="field" rules="required" as="input" />
        <span id="error">{{ errors.field }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const form = wrapper.$el;
    form.submit = submitMock;
    const input = wrapper.$el.querySelector('input');
    await flushPromises();

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(submitMock).toHaveBeenCalledTimes(0);

    setValue(input, '12');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  test('can be renderless', async () => {
    const submitMock = jest.fn();
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm v-slot="{ errors, submitForm }">
          <form @submit="submitForm">
            <Field name="field" rules="required" as="input" />
            <span id="error">{{ errors.field }}</span>

            <button>Validate</button>
          </form>
        </VForm>
      </div>
    `,
    });

    const form = wrapper.$el.querySelector('form');
    form.submit = submitMock;
    const input = wrapper.$el.querySelector('input');
    await flushPromises();

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(submitMock).toHaveBeenCalledTimes(0);

    setValue(input, '12');
    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  test('validation schema with yup', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors }">
        <Field id="email" name="email" as="input" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" as="input" type="password" />
        <span id="passwordErr">{{ errors.password }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const email = wrapper.$el.querySelector('#email');
    const password = wrapper.$el.querySelector('#password');
    const emailError = wrapper.$el.querySelector('#emailErr');
    const passwordError = wrapper.$el.querySelector('#passwordErr');

    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(emailError.textContent).toBe('email is a required field');
    expect(passwordError.textContent).toBe('password is a required field');

    setValue(email, 'hello@');
    setValue(password, '1234');
    await flushPromises();

    expect(emailError.textContent).toBe('email must be a valid email');
    expect(passwordError.textContent).toBe('password must be at least 8 characters');

    setValue(email, 'hello@email.com');
    setValue(password, '12346789');
    await flushPromises();

    expect(emailError.textContent).toBe('');
    expect(passwordError.textContent).toBe('');
  });

  test('validation schema to validate form', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          field: 'required',
          other: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors }">
        <Field name="field" as="input" />
        <span id="field">{{ errors.field }}</span>
        
        <Field name="other" as="input" />
        <span id="other">{{ errors.other }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const first = wrapper.$el.querySelector('#field');
    const second = wrapper.$el.querySelector('#other');

    wrapper.$el.querySelector('button').click();
    await flushPromises();

    expect(first.textContent).toBe(REQUIRED_MESSAGE);
    expect(second.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('cross field validation with yup schema', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          password: yup.string().required(),
          confirmation: yup.string().oneOf([yup.ref('password')], 'passwords must match'),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors }">
        <Field id="password" name="password" as="input" />
        <span id="field">{{ errors.password }}</span>
        
        <Field id="confirmation" name="confirmation" as="input" />
        <span id="confirmationError">{{ errors.confirmation }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    const password = wrapper.$el.querySelector('#password');
    const confirmation = wrapper.$el.querySelector('#confirmation');
    const confirmationError = wrapper.$el.querySelector('#confirmationError');

    wrapper.$el.querySelector('button').click();
    await flushPromises();

    setValue(password, 'hello@');
    setValue(confirmation, '1234');
    await flushPromises();
    expect(confirmationError.textContent).toBe('passwords must match');

    setValue(password, '1234');
    setValue(confirmation, '1234');
    await flushPromises();
    expect(confirmationError.textContent).toBe('');
  });
});
