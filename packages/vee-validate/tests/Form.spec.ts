import { defineRule, useField, Form, Field, useIsValidating, useForm } from '@/vee-validate';
import { mountWithHoc, setValue, setChecked, dispatchEvent, flushPromises } from './helpers';
import * as yup from 'yup';
import { computed, defineComponent, onErrorCaptured, ref, Ref } from 'vue';
import { InvalidSubmissionContext, PrivateFormContext } from '../src/types';

describe('<Form />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  const MIN_MESSAGE = `This field is short`;
  defineRule('required', (value: unknown) => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });
  defineRule('min', (value: unknown, args: any[]) => {
    if (!value || String(value).length <= args[0]) {
      return MIN_MESSAGE;
    }

    return true;
  });

  test('renders the as prop', () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm />
      </div>
    `,
    });

    expect(wrapper.$el.innerHTML).toBe(`<form novalidate=""></form>`);
  });

  test('observes the current state of providers', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ meta }">
        <Field name="field" rules="required" type="text" />

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
      <VForm @submit="submit" v-slot="{ errors }">
        <Field name="field" rules="required" />
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

  test('handles reset event', async () => {
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
      <VForm @reset="reset" v-slot="{ errors }">
        <Field rules="required" name="field" />
        <span id="error">{{ errors.field }}</span>

        <button id="submit">Validate</button>
        <button id="reset" type="reset">Reset</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');

    expect(error.textContent).toBe('');

    wrapper.$el.querySelector('#submit').click();
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    setValue(input, 'value');
    await flushPromises();
    wrapper.$el.querySelector('#reset').click();
    await flushPromises();

    // value was reset
    expect(input.value).toBe('');
    // errors were cleared
    expect(error.textContent).toBe('');
    expect(isReset).toBe(true);
  });

  test('handles reset with resetForm slot prop', async () => {
    const resetError = 'Field is wrong';
    const resetValue = 'I was reset';
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ errors, resetForm, meta, values }">
        <Field rules="required" name="field" />
        <span id="error">{{ errors.field }}</span>
        <span id="dirty">{{ meta.dirty.toString() }}</span>
        <span id="touched">{{ meta.touched.toString() }}</span>

        <button id="submit">Validate</button>
        <button id="reset" type="button" @click="resetForm({ values: { field: '${resetValue}' }, errors: { field: '${resetError}' }, touched: { field: true } })">Reset</button>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const input = wrapper.$el.querySelector('input');

    expect(error.textContent).toBe('');

    wrapper.$el.querySelector('#submit').click();
    await flushPromises();

    expect(error.textContent).toBe(REQUIRED_MESSAGE);

    setValue(input, 'value');
    await flushPromises();
    wrapper.$el.querySelector('#reset').click();
    await flushPromises();

    // value was reset
    expect(input.value).toBe(resetValue);
    // errors were cleared
    expect(error.textContent).toBe(resetError);
    expect(wrapper.$el.querySelector('#dirty').textContent).toBe('false');
    expect(wrapper.$el.querySelector('#touched').textContent).toBe('true');
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
      <VForm :initialValues="initialValues">
        <Field rules="required" name="field" />

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');

    expect(input.value).toBe(initialValues.field);
  });

  test('having no submit listener will submit the form natively', async () => {
    const submitMock = vi.fn();
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ errors }">
        <Field name="field" rules="required" />
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
    const submitMock = vi.fn();
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm as="" v-slot="{ errors, submitForm }">
          <form @submit="submitForm">
            <Field name="field" rules="required" />
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

  test('can be renderless with null', async () => {
    const submitMock = vi.fn();
    const wrapper = mountWithHoc({
      template: `
      <div>
        <VForm :as="null" v-slot="{ errors, submitForm }">
          <form @submit="submitForm">
            <Field name="field" rules="required" />
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
        const schema = yup.object({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validationSchema="schema" v-slot="{ errors }">
        <Field id="email" name="email" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" type="password" />
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
      <VForm :validationSchema="schema" v-slot="{ errors }">
        <Field name="field" />
        <span id="field">{{ errors.field }}</span>

        <Field name="other" />
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
        const schema = yup.object({
          password: yup.string().required(),
          confirmation: yup.string().oneOf([yup.ref('password')], 'passwords must match'),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validationSchema="schema" v-slot="{ errors }">
        <Field id="password" name="password" />
        <span id="field">{{ errors.password }}</span>

        <Field id="confirmation" name="confirmation" />
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

  test('supports radio inputs', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          drink: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors }">
        <Field name="drink" type="radio" value="" /> Coffee
        <Field name="drink" type="radio" value="Tea" /> Tea
        <Field name="drink" type="radio" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');
  });

  test('supports radio inputs with check after submit', async () => {
    const initialValues = { test: 'one' };

    const showFields = ref(true);
    const result = ref();

    const wrapper = mountWithHoc({
      setup() {
        const values = ['one', 'two', 'three'];
        const onSubmit = (formData: Record<string, any>) => {
          result.value = formData.test;
        };

        return {
          values,
          onSubmit,
          initialValues,
          showFields,
          result,
        };
      },
      template: `
      <VForm  @submit="onSubmit"  >

        <label v-for="(value, index) in values" v-bind:key="index">
          <div v-if="showFields">
            <Field name="test" type="radio" :value="value" /> {{value}}
          </div>
        </label>
        <button>Submit</button>
      </VForm>
    `,
    });

    // const err = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');

    setChecked(inputs[1]);
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    showFields.value = false;
    await flushPromises();
    expect(result.value).toBe('two');
  });

  test('supports radio inputs with check after submit (nested)', async () => {
    const initialValues = { test: { fieldOne: { option: 'one' } } };

    const showFields = ref(true);
    const result = ref();

    const wrapper = mountWithHoc({
      setup() {
        const values = ['one', 'two', 'three'];
        const onSubmit = (formData: Record<string, any>) => {
          result.value = formData.test;
        };

        return {
          values,
          onSubmit,
          initialValues,
          showFields,
          result,
        };
      },
      template: `
      <VForm  @submit="onSubmit" :initialValues="initialValues" >
        <label v-for="(value, index) in values" v-bind:key="index">
          <div v-if="showFields">
            <Field name="test.fieldOne.option" type="radio" :value="value" /> {{value}}
          </div>
        </label>

        <button>Submit</button>
      </VForm>
    `,
    });

    // const err = wrapper.$el.querySelector('#err');
    const inputs = wrapper.$el.querySelectorAll('input');
    await flushPromises();
    expect(inputs[0].checked).toBe(true);

    setChecked(inputs[1]);
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    showFields.value = false;
    await flushPromises();
    expect(result.value.fieldOne.option).toBe('two');
  });

  test('supports checkboxes inputs', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          drink: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" type="checkbox" value="" /> Coffee
        <Field name="drink" type="checkbox" value="Tea" /> Tea
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ values.drink && values.drink.toString() }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');

    expect(values.textContent).toBe(['Coke', '', 'Tea'].toString());

    setChecked(inputs[1], false);
    await flushPromises();
    expect(values.textContent).toBe(['Coke', ''].toString());
  });

  test('supports a single checkbox', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          drink: 'required',
        };

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" type="checkbox" :value="true" /> Coffee

        <span id="err">{{ errors.drink }}</span>
        <span id="value">{{ typeof values.drink }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const value = wrapper.$el.querySelector('#value');
    const input = wrapper.$el.querySelector('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    setChecked(input, true);
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(value.textContent).toBe('boolean');
    setChecked(input, false);
    await flushPromises();
    expect(err.textContent).toBe(REQUIRED_MESSAGE);
    expect(value.textContent).toBe('undefined');
  });

  test('unmounted fields gets unregistered and their values cleaned up', async () => {
    const showFields = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        const schema = computed(() => ({
          field: showFields.value ? 'required' : '',
          drink: 'required',
        }));

        return {
          schema,
          showFields,
        };
      },
      template: `
      <VForm :validationSchema="schema" v-slot="{ errors, values }">
        <template v-if="showFields">
          <Field name="field" />
          <Field name="nested.field" />
          <Field name="[non-nested.field]" />
          <Field name="drink" type="checkbox" value="" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" /> Tea
        </template>
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="errors">{{ errors }}</span>
        <span id="values">{{ values }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    expect(JSON.parse(values.textContent)).toEqual({
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    });

    showFields.value = false;
    await flushPromises();
    expect(errors.textContent).toBe('{}');
    expect(JSON.parse(values.textContent)).toEqual({ drink: ['Coke'] });
  });

  test('unmounted fields gets unregistered and submitted values do not include them', async () => {
    let showFields!: Ref<boolean>;
    const spy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        showFields = ref(true);

        return {
          showFields,
          onSubmit(values: any) {
            spy(values);
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ errors }">
        <template v-if="showFields">
          <Field name="field" rules="required" />
          <Field name="nested.field" rules="required" />
          <Field name="[non-nested.field]" rules="required" />
          <Field name="drink" type="checkbox" value="" rules="required" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" rules="required" /> Tea
        </template>
        <Field name="drink" type="checkbox" value="Coke" rules="required" /> Coke

        <span id="errors">{{ errors }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const button = wrapper.$el.querySelector('button');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    button.click();
    await flushPromises();
    expect(spy).toHaveBeenLastCalledWith({
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    });

    showFields.value = false;
    await flushPromises();
    expect(errors.textContent).toBe('{}');
    button.click();
    await flushPromises();
    expect(spy).toHaveBeenLastCalledWith({ drink: ['Coke'] });
  });

  test('unmounted fields gets unregistered and their values are kept if configured on the form level', async () => {
    const showFields = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        const schema = computed(() => ({
          field: showFields.value ? 'required' : '',
          drink: 'required',
        }));

        return {
          schema,
          showFields,
        };
      },
      template: `
      <VForm :validationSchema="schema" v-slot="{ errors, values }" keep-values>
        <template v-if="showFields">
          <Field name="field" />
          <Field name="nested.field" />
          <Field name="[non-nested.field]" />
          <Field name="drink" type="checkbox" value="" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" /> Tea
        </template>
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="errors">{{ errors }}</span>
        <span id="values">{{ values }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    const expected = {
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    };
    expect(JSON.parse(values.textContent)).toEqual(expected);

    showFields.value = false;
    await flushPromises();
    // errors were cleared
    expect(errors.textContent).toBe('{}');
    expect(JSON.parse(values.textContent)).toEqual(expected);
  });

  test('unmounted fields gets unregistered and their submitted values are kept if configured on the form level', async () => {
    let showFields!: Ref<boolean>;
    const spy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        showFields = ref(true);

        return {
          showFields,
          onSubmit(values: any) {
            spy(values);
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ errors }" keep-values>
        <template v-if="showFields">
          <Field name="field" rules="required" />
          <Field name="nested.field" rules="required" />
          <Field name="[non-nested.field]" rules="required" />
          <Field name="drink" type="checkbox" value="" rules="required" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" rules="required" /> Tea
        </template>

        <Field name="drink" type="checkbox" value="Coke" rules="required" /> Coke

        <span id="errors">{{ errors }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const button = wrapper.$el.querySelector('button');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    button.click();
    await flushPromises();
    const expected = {
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    };
    expect(spy).toHaveBeenLastCalledWith(expected);

    showFields.value = false;
    await flushPromises();
    expect(errors.textContent).toBe('{}');
    button.click();
    await flushPromises();
    expect(spy).toHaveBeenLastCalledWith(expected);
  });

  test('unmounted fields gets unregistered and their values are kept if configured on the field level', async () => {
    const showFields = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        const schema = computed(() => ({
          field: showFields.value ? 'required' : '',
          drink: 'required',
        }));

        return {
          schema,
          showFields,
        };
      },
      template: `
      <VForm :validationSchema="schema" v-slot="{ errors, values }">
        <template v-if="showFields">
          <Field name="field" />
          <Field name="nested.field" keep-value />
          <Field name="[non-nested.field]" keep-value />
          <Field name="drink" type="checkbox" value="" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" keep-value /> Tea
        </template>
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="errors">{{ errors }}</span>
        <span id="values">{{ values }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    expect(JSON.parse(values.textContent)).toEqual({
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    });

    showFields.value = false;
    await flushPromises();
    // errors were cleared
    expect(errors.textContent).toBe('{}');
    expect(JSON.parse(values.textContent)).toEqual({
      drink: ['Tea', 'Coke'],
      'non-nested.field': '12',
      nested: { field: '12' },
    });
  });

  test('unmounted fields gets unregistered and their submitted values are kept if configured on the field level', async () => {
    let showFields!: Ref<boolean>;
    const spy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        showFields = ref(true);

        return {
          showFields,
          onSubmit(values: any) {
            spy(values);
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ errors }">
        <template v-if="showFields">
          <Field name="field" rules="required" />
          <Field name="nested.field" rules="required" keep-value />
          <Field name="[non-nested.field]" rules="required" keep-value />
          <Field name="drink" type="checkbox" value="" rules="required" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" rules="required" keep-value /> Tea
        </template>
        <Field name="drink" type="checkbox" value="Coke" rules="required" /> Coke

        <span id="errors">{{ errors }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const button = wrapper.$el.querySelector('button');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    button.click();
    await flushPromises();
    expect(spy).toHaveBeenLastCalledWith({
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    });

    showFields.value = false;
    await flushPromises();
    expect(errors.textContent).toBe('{}');
    button.click();
    await flushPromises();
    expect(spy).toHaveBeenLastCalledWith({
      drink: ['Tea', 'Coke'],
      'non-nested.field': '12',
      nested: { field: '12' },
    });
  });

  test('can specify which fields get their value kept with field setting priority', async () => {
    const showFields = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        const schema = computed(() => ({
          field: showFields.value ? 'required' : '',
          drink: 'required',
        }));

        return {
          schema,
          showFields,
        };
      },
      template: `
      <VForm :validationSchema="schema" v-slot="{ errors, values }" keep-values>
        <template v-if="showFields">
          <Field name="field" />
          <Field name="nested.field" :keep-value="false" />
          <Field name="[non-nested.field]" :keep-value="false" />
          <Field name="drink" type="checkbox" value="" /> Coffee
          <Field name="drink" type="checkbox" value="Tea" :keep-value="false" /> Tea
          <Field name="drink" type="checkbox" value="Coke" /> Coke
        </template>

        <span id="errors">{{ errors }}</span>
        <span id="values">{{ values }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    await flushPromises();
    const errors = wrapper.$el.querySelector('#errors');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(errors.textContent).toBeTruthy();
    setChecked(inputs[4]);
    setChecked(inputs[5]);
    setValue(inputs[0], 'test');
    setValue(inputs[1], '12');
    setValue(inputs[2], '12');
    await flushPromises();
    expect(JSON.parse(values.textContent)).toEqual({
      drink: ['Tea', 'Coke'],
      field: 'test',
      'non-nested.field': '12',
      nested: { field: '12' },
    });

    showFields.value = false;
    await flushPromises();
    // errors were cleared
    expect(errors.textContent).toBe('{}');
    expect(JSON.parse(values.textContent)).toEqual({
      drink: ['Coke'],
      field: 'test',
    });
  });

  test('checkboxes with yup schema', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          drink: yup.array().required().min(1),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" type="checkbox" value="" /> Coffee
        <Field name="drink" type="checkbox" value="Tea" /> Tea
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ values.drink && values.drink.toString() }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe('drink is a required field');
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');

    expect(values.textContent).toBe(['Coke', '', 'Tea'].toString());

    setChecked(inputs[1], false);
    await flushPromises();
    expect(values.textContent).toBe(['Coke', ''].toString());
  });

  test('checkboxes with object values', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          drink: yup.array().required().min(1),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" type="checkbox" :value="{ id: '' }" /> Coffee
        <Field name="drink" type="checkbox" :value="{ id: 'tea' }" /> Tea
        <Field name="drink" type="checkbox" :value="{ id: 'coke' }" /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ JSON.stringify(values.drink) }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe('drink is a required field');
    setChecked(inputs[2]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[0]);
    await flushPromises();
    expect(err.textContent).toBe('');

    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');

    expect(values.textContent).toBe(JSON.stringify([{ id: 'coke' }, { id: '' }, { id: 'tea' }]));

    setChecked(inputs[1], false);
    await flushPromises();
    expect(values.textContent).toBe(JSON.stringify([{ id: 'coke' }, { id: '' }]));
  });

  test('checkboxes v-model value syncing', async () => {
    const drinks = ref<string[]>([]);
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          drink: yup.array().required().min(1),
        });

        return {
          schema,
          drinks,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field v-model="drinks" name="drink" type="checkbox" value="" validateOnModelUpdate /> Coffee
        <Field v-model="drinks" name="drink" type="checkbox" value="Tea" validateOnModelUpdate /> Tea
        <Field v-model="drinks" name="drink" type="checkbox" value="Coke" validateOnModelUpdate /> Coke

        <span id="err">{{ errors.drink }}</span>
        <span id="values">{{ values.drink && values.drink.toString() }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const err = wrapper.$el.querySelector('#err');
    const values = wrapper.$el.querySelector('#values');
    const inputs = wrapper.$el.querySelectorAll('input');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(err.textContent).toBe('drink field must have at least 1 items');
    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(drinks.value).toEqual(['Tea']);

    drinks.value = [];
    await flushPromises();
    expect(err.textContent).toBe('drink field must have at least 1 items');
    expect(values.textContent).toBe('');

    drinks.value = ['Coke'];
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(values.textContent).toBe(['Coke'].toString());
  });

  test('isSubmitting state', async () => {
    let throws = false;
    const wrapper = mountWithHoc({
      setup() {
        onErrorCaptured(() => false);
        return {
          onSubmit() {
            return new Promise((resolve, reject) => {
              if (throws) {
                setTimeout(() => {
                  reject(new Error('Sorry'));
                }, 500);
                return;
              }

              setTimeout(resolve, 1000);
            });
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ isSubmitting }">

        <button id="submit">Submit</button>
        <span id="submitting">{{ isSubmitting }}</span>
      </VForm>
    `,
    });

    const submit = wrapper.$el.querySelector('#submit');
    const submitting = wrapper.$el.querySelector('#submitting');
    submit.click();
    await flushPromises();
    expect(submitting.textContent).toBe('true');
    vi.advanceTimersByTime(1001);
    await flushPromises();
    expect(submitting.textContent).toBe('false');

    throws = true;
    submit.click();
    await flushPromises();
    expect(submitting.textContent).toBe('true');
    vi.advanceTimersByTime(501);
    await flushPromises();
    expect(submitting.textContent).toBe('false');
  });

  test('isValidating state', async () => {
    const spy = vi.fn((isValidating: boolean) => isValidating);

    const Input = defineComponent({
      components: {
        Field,
      },
      template: `<Field name="field" />`,
      setup() {
        const isValidating = useIsValidating();

        useField('field', () => {
          spy(isValidating.value);
          return true;
        });
      },
    });
    const wrapper = mountWithHoc({
      components: {
        Input,
      },
      template: `
      <VForm v-slot="{ validate }">
        <Input />
        <button @click="validate">Validate</button>
      </VForm>
    `,
    });

    await flushPromises();
    const button = wrapper.$el.querySelector('button');
    button.click();

    await flushPromises();
    expect(spy).toHaveLastReturnedWith(true);
  });

  test('aggregated meta reactivity', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ meta }">
        <Field name="field" rules="required"  />

        <button :disabled="!meta.valid" id="submit">Submit</button>
      </VForm>
    `,
    });

    const submitBtn = wrapper.$el.querySelector('#submit');
    const input = wrapper.$el.querySelector('input');
    await flushPromises();
    expect(submitBtn.disabled).toBe(true);
    setValue(input, '12');
    await flushPromises();
    expect(submitBtn.disabled).toBe(false);
  });

  test('nested object fields', async () => {
    const fn = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        return {
          onSubmit(values: any) {
            fn(values);
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ values }">
        <Field name="user.name" rules="required"  />
        <Field name="user.addresses.0" id="address" rules="required"  />
        <pre>{{ values }}</pre>

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const submitBtn = wrapper.$el.querySelector('#submit');
    const name = wrapper.$el.querySelector('input');
    const address = wrapper.$el.querySelector('#address');
    const pre = wrapper.$el.querySelector('pre');
    setValue(name, '12');
    setValue(address, 'abc');
    await flushPromises();
    expect(pre.textContent).toBe(JSON.stringify({ user: { name: '12', addresses: ['abc'] } }, null, 2));
    submitBtn.click();
    await flushPromises();
    expect(fn).toHaveBeenCalledWith({ user: { name: '12', addresses: ['abc'] } });
  });

  test('nested object fields validation with yup nested objects', async () => {
    const fn = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        return {
          schema: yup.object({
            user: yup.object({
              name: yup.string().required(),
              addresses: yup.array().of(yup.string().required().min(3)).required(),
            }),
          }),
          onSubmit(values: any) {
            fn(values);
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ errors }" :validation-schema="schema">
        <Field name="user.name" />
        <span id="nameErr">{{ errors['user.name'] }}</span>
        <Field name="user.addresses[0]" id="address" />
        <span id="addrErr">{{ errors['user.addresses[0]'] }}</span>

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const submitBtn = wrapper.$el.querySelector('#submit');
    const name = wrapper.$el.querySelector('input');
    const nameErr = wrapper.$el.querySelector('#nameErr');
    const address = wrapper.$el.querySelector('#address');
    const addrErr = wrapper.$el.querySelector('#addrErr');
    submitBtn.click();
    await flushPromises();

    expect(fn).not.toHaveBeenCalled();
    expect(nameErr.textContent).toBeTruthy();
    expect(addrErr.textContent).toBeTruthy();
    setValue(name, '12');
    setValue(address, 'abc');
    await flushPromises();
    expect(nameErr.textContent).toBe('');
    expect(addrErr.textContent).toBe('');
    submitBtn.click();
    await flushPromises();

    expect(fn).toHaveBeenCalledWith({ user: { name: '12', addresses: ['abc'] } });
  });

  test('can opt out of nested object fields', async () => {
    const fn = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        return {
          onSubmit(values: any) {
            fn(values);
          },
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ values }">
        <Field name="[user.name]" rules="required"  />
        <Field name="[user.addresses.0]" id="address" rules="required"  />
        <pre>{{ values }}</pre>

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const submitBtn = wrapper.$el.querySelector('#submit');
    const name = wrapper.$el.querySelector('input');
    const address = wrapper.$el.querySelector('#address');
    const pre = wrapper.$el.querySelector('pre');
    setValue(name, '12');
    setValue(address, 'abc');
    await flushPromises();
    expect(pre.textContent).toBe(JSON.stringify({ 'user.name': '12', 'user.addresses.0': 'abc' }, null, 2));
    submitBtn.click();
    await flushPromises();
    expect(fn).toHaveBeenCalledWith({ 'user.name': '12', 'user.addresses.0': 'abc' });
  });

  test('validate fields on mount with validateOnMount = true', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validationSchema="schema" validateOnMount v-slot="{ errors }">
        <Field id="email" name="email" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" type="password" />
        <span id="passwordErr">{{ errors.password }}</span>

        <button>Validate</button>
      </VForm>
    `,
    });

    await flushPromises();

    const emailError = wrapper.$el.querySelector('#emailErr');
    const passwordError = wrapper.$el.querySelector('#passwordErr');

    await flushPromises();

    expect(emailError.textContent).toBe('email is a required field');
    expect(passwordError.textContent).toBe('password is a required field');
  });

  test('sets individual field error message with setFieldError()', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form" v-slot="{ errors }">
        <Field id="email" name="email" />
        <span id="emailErr">{{ errors.email }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const emailError = wrapper.$el.querySelector('#emailErr');
    (wrapper.$refs as any)?.form.setFieldError('email', 'WRONG');
    await flushPromises();

    expect(emailError.textContent).toBe('WRONG');
  });

  test('sets multiple field error messages with setErrors()', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form" v-slot="{ errors }">
        <Field id="email" name="email" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" type="password" />
        <span id="passwordErr">{{ errors.password }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const emailError = wrapper.$el.querySelector('#emailErr');
    const passwordError = wrapper.$el.querySelector('#passwordErr');

    (wrapper.$refs as any)?.form.setErrors({
      email: 'WRONG',
      password: 'WRONG AGAIN',
    });
    await flushPromises();

    expect(emailError.textContent).toBe('WRONG');
    expect(passwordError.textContent).toBe('WRONG AGAIN');
  });

  test('sets error message with setFieldError for checkboxes', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form" v-slot="{ errors }">
        <Field name="drink" type="checkbox" value="" /> Coffee
        <Field name="drink" type="checkbox" value="Tea" /> Tea
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="err">{{ errors.drink }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const error = wrapper.$el.querySelector('#err');
    (wrapper.$refs as any)?.form.setFieldError('drink', 'WRONG');
    await flushPromises();
    expect(error.textContent).toBe('WRONG');
  });

  test('sets individual field value with setFieldValue()', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form">
        <Field id="email" name="email" />
      </VForm>
    `,
    });

    await flushPromises();
    const value = 'example@gmail.com';
    const email = wrapper.$el.querySelector('#email');
    (wrapper.$refs as any)?.form.setFieldValue('email', value);
    await flushPromises();
    expect(email.value).toBe(value);
  });

  test('sets multiple fields values with setValues()', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form">
        <Field id="email" name="email" />
        <Field id="password" name="password" />
      </VForm>
    `,
    });

    await flushPromises();
    const values = {
      email: 'example@gmail.com',
      password: '12345',
    };
    const inputs = wrapper.$el.querySelectorAll('input');
    (wrapper.$refs as any)?.form.setValues(values);
    await flushPromises();
    expect(inputs[0].value).toBe(values.email);
    expect(inputs[1].value).toBe(values.password);
  });

  test('sets non-plain object field with setValues()', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form">
        <Field id="nonPlain" name="nonPlain" />
      </VForm>
    `,
    });

    await flushPromises();

    class NonPlain {
      field = 5;
    }
    const nonPlain = new NonPlain();
    (wrapper.$refs as any)?.form.setValues({
      nonPlain,
    });

    const realValues = (wrapper.$refs as any).form.getValues();
    await flushPromises();
    expect(realValues.nonPlain).toBeInstanceOf(NonPlain);
    expect(realValues.nonPlain).toStrictEqual(nonPlain);
  });

  test('handles submit with handleSubmit and passing the event object', async () => {
    const spy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
          onSubmit: spy,
        };
      },
      template: `
      <VForm as="div" :validationSchema="schema" v-slot="{ errors, handleSubmit }">
        <form @submit="handleSubmit($event, onSubmit)">
          <Field id="email" name="email" />
          <span id="emailErr">{{ errors.email }}</span>

          <Field id="password" name="password" type="password" />
          <span id="passwordErr">{{ errors.password }}</span>

          <button>Validate</button>
        </form>
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
    expect(spy).toHaveBeenCalledTimes(0);

    setValue(email, 'hello@email.com');
    setValue(password, '12346789');
    wrapper.$el.querySelector('button').click();

    await flushPromises();

    expect(emailError.textContent).toBe('');
    expect(passwordError.textContent).toBe('');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('handles submit with handleSubmit without the event object', async () => {
    const spy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
          onSubmit: spy,
        };
      },
      template: `
      <VForm as="div" :validationSchema="schema" v-slot="{ errors, handleSubmit }">
        <form @submit.prevent.stop="handleSubmit(onSubmit)">
          <Field id="email" name="email" />
          <span id="emailErr">{{ errors.email }}</span>

          <Field id="password" name="password" type="password" />
          <span id="passwordErr">{{ errors.password }}</span>

          <button>Validate</button>
        </form>
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
    expect(spy).toHaveBeenCalledTimes(0);

    setValue(email, 'hello@email.com');
    setValue(password, '12346789');
    wrapper.$el.querySelector('button').click();

    await flushPromises();

    expect(emailError.textContent).toBe('');
    expect(passwordError.textContent).toBe('');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('sets meta touched with setFieldTouched for checkboxes', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="form" v-slot="{ meta }">
        <Field name="drink" type="checkbox" value="" /> Coffee
        <Field name="drink" type="checkbox" value="Tea" /> Tea
        <Field name="drink" type="checkbox" value="Coke" /> Coke

        <span id="meta">{{ meta.touched }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const meta = wrapper.$el.querySelector('#meta');
    expect(meta?.textContent).toBe('false');
    (wrapper.$refs as any)?.form.setFieldTouched('drink', true);
    await flushPromises();
    expect(meta?.textContent).toBe('true');
  });

  test('sets initial errors with initialErrors', async () => {
    const errors = {
      password: 'too short',
      email: 'wrong',
    };
    const wrapper = mountWithHoc({
      setup() {
        return {
          errors,
        };
      },
      template: `
      <VForm ref="form" :initial-errors="errors">
        <Field id="email" name="email" />
        <ErrorMessage name="email" />
        <Field id="password" name="password" />
        <ErrorMessage name="password" />
      </VForm>
    `,
    });

    await flushPromises();
    const errorEls = wrapper.$el.querySelectorAll('span');
    await flushPromises();
    expect(errorEls[0].textContent).toBe(errors.email);
    expect(errorEls[1].textContent).toBe(errors.password);
  });

  test('sets touched with initial touched', async () => {
    const touched = {
      email: true,
    };
    const wrapper = mountWithHoc({
      setup() {
        return {
          touched,
        };
      },
      template: `
      <VForm ref="form" :initial-touched="touched">
        <Field id="email" name="email"  v-slot="{ meta, field }">
          <input v-bind="field" />
          <span>{{ meta.touched }}</span>
        </Field>
      </VForm>
    `,
    });

    await flushPromises();
    const meta = wrapper.$el.querySelector('span');
    await flushPromises();
    expect(meta.textContent).toBe('true');
  });

  test('counts the number of submission attempts', async () => {
    const spy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        return {
          onSubmit: spy,
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ submitCount }">
        <Field id="email" name="email" />
        <span>{{ submitCount }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const countSpan = wrapper.$el.querySelector('span');
    expect(countSpan.textContent).toBe('0');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(countSpan.textContent).toBe('1');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(countSpan.textContent).toBe('2');
    expect(spy).toHaveReturnedTimes(2);
  });

  test('can reset the submit count to whatever value with resetForm', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          onSubmit: vi.fn(),
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ submitCount, resetForm }">
        <Field id="email" name="email" />
        <span>{{ submitCount }}</span>

        <button>Submit</button>
        <button type="button" id="reset" @click="resetForm({ submitCount: 5 })">Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const countSpan = wrapper.$el.querySelector('span');
    expect(countSpan.textContent).toBe('0');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(countSpan.textContent).toBe('1');
    wrapper.$el.querySelector('#reset').click();
    await flushPromises();
    expect(countSpan.textContent).toBe('5');
  });

  // #3084
  test('reset should not toggle the checkbox values', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm>
        <Field name="field" type="checkbox" :value="true" />

        <button type="reset">Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    const btn = wrapper.$el.querySelector('button');
    setChecked(input, true);
    await flushPromises();
    btn.click();
    await flushPromises();
    expect(input.checked).toBe(false);

    btn.click();
    await flushPromises();
    expect(input.checked).toBe(false);
  });

  // #3166
  test('fields replacing others with the same name should have their value set correctly', async () => {
    const data = [
      {
        id: 1,
        title: 'this is a test no 1',
      },
      {
        id: 2,
        title: 'this is a test no 2',
      },
      {
        id: 3,
        title: 'this is a test no 3',
      },
      {
        id: 4,
        title: 'this is a test no 4',
      },
    ];
    let setModified!: (field: { id: number; title: string }) => void;
    mountWithHoc({
      setup() {
        const fields = ref(data);
        const modified = ref({ id: -1, title: '' });
        setModified = (item: { id: number; title: string }) => {
          modified.value = { ...item };
        };

        return {
          fields,
          setModified,
          modified,
        };
      },
      template: `
        <VForm>
          <ul>
            <li v-for="field in fields" :key="field.id">
              <Field v-if="modified.id === field.id" name="test" v-model="modified.title" type="text" />
            </li>
          </ul>
        </VForm>
    `,
    });

    await flushPromises();

    const input = () => document.querySelector('input');
    setModified(data[3]);
    await flushPromises();
    expect(input()?.value).toBe(data[3].title);

    setModified(data[2]);
    await flushPromises();
    expect(input()?.value).toBe(data[2].title);
  });

  test('resetForm should reset the meta flag', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm  v-slot="{ meta, resetForm }">
        <Field id="email" name="email" rules="required" />
        <Field id="password" name="password" rules="required" />

        <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
        <button type="button" @click="resetForm()">Reset</button>
      </VForm>
    `,
    });

    await flushPromises();
    const span = wrapper.$el.querySelector('#meta');
    const input = wrapper.$el.querySelector('input');
    expect(span.textContent).toBe('invalid');
    setValue(input, '');
    await flushPromises();

    expect(span.textContent).toBe('invalid');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(span.textContent).toBe('invalid');
  });

  test('resetForm should reset the meta flag based on the errors length', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm :initial-values="{ email: '2', password: '3' }"  v-slot="{ meta, resetForm }">
        <Field id="email" name="email" rules="required" />
        <Field id="password" name="password" rules="required" />

        <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
        <button type="button" @click="resetForm({ errors: { email: 'bad' } })">Reset</button>
      </VForm>
    `,
    });

    await flushPromises();
    const span = wrapper.$el.querySelector('#meta');
    expect(span.textContent).toBe('valid');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(span.textContent).toBe('invalid');
  });

  test('valid flag should reflect the accurate form validity', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm  v-slot="{ meta, resetForm }">
        <Field id="email" name="email" rules="required" />
        <Field id="password" name="password" rules="required" />

        <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const span = wrapper.$el.querySelector('#meta');
    expect(span.textContent).toBe('invalid');

    const email = wrapper.$el.querySelector('#email');
    setValue(email, '');
    await flushPromises();
    // the email field is invalid
    expect(span.textContent).toBe('invalid');

    // should be valid now
    setValue(email, 'example@test.com');
    await flushPromises();
    // still invalid because the password is invalid
    expect(span.textContent).toBe('invalid');

    const password = wrapper.$el.querySelector('#password');
    setValue(password, '12');
    await flushPromises();
    expect(span.textContent).toBe('valid');
  });

  // #3228
  test('should not validate touched fields with yup schema if other fields value change', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required(),
          password: yup.string().required(),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema"  v-slot="{ errors }">
        <Field id="email" name="email" :validate-on-blur="false" />
        <Field id="password" name="password" :validate-on-blur="false" />

        <span>{{ errors.email }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const span = wrapper.$el.querySelector('span');
    const email = wrapper.$el.querySelector('#email');
    const password = wrapper.$el.querySelector('#password');
    // the field is now blurred
    dispatchEvent(email, 'blur');
    await flushPromises();
    // no error messages for email
    expect(span.textContent).toBe('');

    // should be valid now
    setValue(password, '');
    await flushPromises();
    // again there should be no error messages for email, only the password
    expect(span.textContent).toBe('');
  });

  test('can set multiple field errors on the form level', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ setFieldError }">
        <Field name="whatever" v-slot="{ field, errors, setErrors }" rules="required">
          <input v-bind="field" />
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
          <button type="button" @click="setFieldError('whatever', ['bad', 'wrong'])">Set errors</button>
        </Field>
      </VForm>
    `,
    });

    await flushPromises();
    const list = document.querySelector('ul');
    expect(list?.children).toHaveLength(0);
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(list?.children).toHaveLength(2);
    expect(list?.textContent).toBe('badwrong');
  });

  test('supports computed yup schemas', async () => {
    mountWithHoc({
      setup() {
        const acceptList = ref(['1', '2']);
        const schema = computed(() => {
          return yup.object({
            password: yup.string().oneOf(acceptList.value),
          });
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors }">
        <Field name="password" />
        <span>{{ errors.password }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    expect(document.querySelector('span')?.textContent).toBe('');
    setValue(input, '3');
    await flushPromises();
    // 3 is not allowed yet
    expect(document.querySelector('span')?.textContent).toBeTruthy();
    await flushPromises();
    // field is re-validated
    setValue(input, '2');
    await flushPromises();

    expect(document.querySelector('span')?.textContent).toBe('');
  });

  test('re-validates when a computed yup schema changes', async () => {
    const acceptList = ref(['1', '2']);
    function addItem(item: string) {
      acceptList.value.push(item);
    }

    mountWithHoc({
      setup() {
        const schema = computed(() => {
          return yup.object({
            password: yup.string().oneOf(acceptList.value),
          });
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors }">
        <Field name="password" />
        <span>{{ errors.password }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    expect(document.querySelector('span')?.textContent).toBe('');
    setValue(input, '3');
    await flushPromises();
    // 3 is not allowed yet
    expect(document.querySelector('span')?.textContent).toBeTruthy();

    // field is re-validated automatically
    addItem('3');
    await flushPromises();
    expect(document.querySelector('span')?.textContent).toBe('');
  });

  test('submitting forms should touch fields', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          onSubmit: vi.fn(),
        };
      },
      template: `
      <VForm @submit="onSubmit" v-slot="{ meta }">
        <Field id="email" name="email" rules="required" />
        <Field id="password" name="password" rules="required" v-slot="fieldProps">
          <input v-bind="fieldProps.field" />
          <span id="fieldMeta">{{ fieldProps.meta.touched ? 'touched' : 'untouched' }}</span>
        </Field>

        <span id="meta">{{ meta.touched ? 'touched' : 'untouched' }}</span>
        <button type="submit">Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const formMeta = wrapper.$el.querySelector('#meta');
    const fieldMeta = wrapper.$el.querySelector('#fieldMeta');
    expect(formMeta.textContent).toBe('untouched');
    expect(fieldMeta.textContent).toBe('untouched');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(formMeta.textContent).toBe('touched');
    expect(fieldMeta.textContent).toBe('touched');
  });

  test('non-rendered fields defined in yup schema are not ignored', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required(),
          password: yup.string().required(),
        });

        return {
          onSubmit: vi.fn(),
          schema,
        };
      },
      template: `
      <VForm @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <Field name="email" />
        <span id="passwordError">{{ errors.password }}</span>

        <button type="submit">Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const passwordError = wrapper.$el.querySelector('#passwordError');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(passwordError.textContent).toBeTruthy();
  });

  test('non-rendered fields defined in schema are not ignored', async () => {
    const submit = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          email: 'required',
          password: 'required',
        };

        return {
          onSubmit: submit,
          schema,
        };
      },
      template: `
      <VForm @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <Field name="email" />
        <span id="passwordError">{{ errors.password }}</span>

        <button type="submit">Submit</button>
      </VForm>
    `,
    });

    await flushPromises();
    const passwordError = wrapper.$el.querySelector('#passwordError');

    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(passwordError.textContent).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });

  test('setting errors for non-existing fields creates them as virtual', async () => {
    const errorMessage = 'bad pw';
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ errors, setFieldError }">
        <span id="passwordError">{{ errors.password }}</span>
        <button type="button" @click="setFieldError('password', '${errorMessage}')">Set error</button>
      </VForm>
    `,
    });

    await flushPromises();
    const passwordError = wrapper.$el.querySelector('#passwordError');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(passwordError.textContent).toBe(errorMessage);
  });

  test('setting values for non-existing fields creates them as virtual', async () => {
    const value = '123';
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ values, setFieldValue }">
        <span id="passwordValue">{{ values.password }}</span>
        <button type="button" @click="setFieldValue('password', '${value}')">Set value</button>
      </VForm>
    `,
    });

    await flushPromises();
    const passwordValue = wrapper.$el.querySelector('#passwordValue');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(passwordValue.textContent).toBe(value);
  });

  test('reset virtual fields errors and values', async () => {
    const errorMessage = 'bad pw';
    const value = '123';
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ errors, values, setFieldError, setFieldValue, resetForm }">
        <span id="passwordError">{{ errors.password }}</span>
        <span id="passwordValue">{{ values.password }}</span>

        <button id="setError" type="button" @click="setFieldError('password', '${errorMessage}')">Set error</button>
        <button id="setValue" type="button" @click="setFieldValue('password', '${value}')">Set value</button>

        <button id="reset" type="button" @click="resetForm()">Reset</button>
      </VForm>
    `,
    });

    await flushPromises();
    const passwordError = wrapper.$el.querySelector('#passwordError');
    const passwordValue = wrapper.$el.querySelector('#passwordValue');
    wrapper.$el.querySelector('#setValue').click();
    await flushPromises();
    wrapper.$el.querySelector('#setError').click();
    await flushPromises();
    expect(passwordError.textContent).toBe(errorMessage);
    expect(passwordValue.textContent).toBe(value);
    wrapper.$el.querySelector('#reset').click();
    await flushPromises();
    expect(passwordError.textContent).toBe('');
    expect(passwordValue.textContent).toBe('');
  });

  test('reset virtual field state to specific value and error', async () => {
    const errorMessage = 'bad pw';
    const value = '123';
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ errors, values, resetForm }">
        <span id="passwordError">{{ errors.password }}</span>
        <span id="passwordValue">{{ values.password }}</span>
        <button id="reset" type="button" @click="resetForm({ values: { password: '${value}' }, errors: { password: '${errorMessage}' } })">Reset</button>
      </VForm>
    `,
    });

    await flushPromises();
    const passwordError = wrapper.$el.querySelector('#passwordError');
    const passwordValue = wrapper.$el.querySelector('#passwordValue');
    expect(passwordError.textContent).toBe('');
    expect(passwordValue.textContent).toBe('');
    wrapper.$el.querySelector('#reset').click();
    await flushPromises();
    expect(passwordError.textContent).toBe(errorMessage);
    expect(passwordValue.textContent).toBe(value);
  });

  // #3332
  test('field bails prop should work with validation schema', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          schema: {
            fname: 'required|min:3',
          },
        };
      },
      template: `
      <VForm :validation-schema="schema">
        <Field name="fname" :bails="false" v-slot="{ field, errors }">
          <input type="text" v-bind="field" />
          <div v-for="error in errors" :key="error" class="error">
            {{ error }}
          </div>
        </Field>
      </VForm>
    `,
    });

    await flushPromises();
    const input = wrapper.$el.querySelector('input');
    setValue(input, '');
    await flushPromises();
    expect(document.querySelectorAll('.error')).toHaveLength(2);
  });

  // #3342
  test('field with pre-register errors should be checked on register', async () => {
    const isShown = ref(false);
    const modelValue = ref('');
    const wrapper = mountWithHoc({
      setup() {
        return {
          isShown,
          modelValue,
          schema: {
            fname: 'required',
          },
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors }">
        <Field v-if="isShown" name="fname" v-model="modelValue" />
        <span>{{ errors.fname }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const span = wrapper.$el.querySelector('span');
    expect(span.textContent).toBe(REQUIRED_MESSAGE);
    modelValue.value = 'hello';
    isShown.value = true;

    await flushPromises();
    // field was re-checked
    expect(span.textContent).toBe('');
  });

  test('field errors should be removed when its unmounted', async () => {
    const isShown = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        return {
          isShown,
        };
      },
      template: `
      <VForm v-slot="{ errors }">
        <Field v-if="isShown" name="fname"  rules="required"/>
        <span>{{ errors.fname }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const span = wrapper.$el.querySelector('span');
    setValue(wrapper.$el.querySelector('input'), '');
    await flushPromises();
    expect(span.textContent).toBe(REQUIRED_MESSAGE);
    isShown.value = false;

    await flushPromises();
    // field was re-checked
    expect(span.textContent).toBe('');
  });

  test('standalone fields are excluded from form state', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {};
      },
      template: `
      <VForm  v-slot="{ errors, meta }">
        <Field name="fname" standalone v-slot="{ errorMessage, field }" rules="required">
          <input v-bind="field" />
          <span id="fieldError">{{ errorMessage }}</span>
        </Field>
        <span id="formError">{{ errors.fname }}</span>
        <span id="meta">{{ meta.valid }}</span>
      </VForm>
    `,
    });

    await flushPromises();
    const formError = wrapper.$el.querySelector('#formError');
    const fieldError = wrapper.$el.querySelector('#fieldError');
    const meta = wrapper.$el.querySelector('#meta');

    expect(formError.textContent).toBe('');
    expect(fieldError.textContent).toBe('');
    expect(meta.textContent).toBe('true');

    setValue(wrapper.$el.querySelector('input'), '');
    await flushPromises();

    expect(formError.textContent).toBe('');
    expect(fieldError.textContent).toBe(REQUIRED_MESSAGE);
    expect(meta.textContent).toBe('true');
  });

  // #3424
  test('Checkbox with v-model should not propagate the empty value symbol', async () => {
    const value = ref('');
    mountWithHoc({
      setup() {
        return {
          value,
        };
      },
      template: `
      <VForm>
        <Field name="check" type="checkbox" v-model="value" value="CHECKED" />
      </VForm>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    setChecked(input, true);
    await flushPromises();
    expect(value.value).toBe('CHECKED');

    setChecked(input, false);
    await flushPromises();

    expect(value.value).toBe(undefined);
  });

  // #3429
  test('Two fields of the same name should not override each other value when either is mounted', async () => {
    const isHidden = ref(false);
    const value = ref('');
    mountWithHoc({
      setup() {
        return {
          value,
          isHidden,
        };
      },
      template: `
      <VForm>
        <Field name="name" type="text" v-model="value" />
        <Field v-if="isHidden" name="name" type="text" v-model="value" />
      </VForm>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    setValue(input, '1234');
    await flushPromises();
    isHidden.value = true;
    await flushPromises();
    expect(input.value).toBe(value.value);
  });

  // #4200
  test('Falsy model value should still have priority over form value', async () => {
    const value = ref(0);
    mountWithHoc({
      setup() {
        const initials = { age: 2 };
        return {
          value,
          initials,
        };
      },
      template: `
      <VForm :initial-values="initials">
        <Field name="age" type="number" v-model="value" />
      </VForm>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('0');
  });

  test('handles invalid submissions', async () => {
    const invalidSpy = vi.fn();
    const validSpy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
          onInvalidSubmit: invalidSpy,
          onSubmit: validSpy,
        };
      },
      template: `
      <VForm :validationSchema="schema" @invalid-submit="onInvalidSubmit" @submit="onSubmit" v-slot="{ errors }">
        <Field id="email" name="email" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" type="password" />
        <span id="passwordErr">{{ errors.password }}</span>

        <button>Submit</button>
      </VForm>
    `,
    });

    const expectedEmailError = 'email is a required field';
    const expectedPasswordError = 'password is a required field';
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(invalidSpy).toHaveBeenCalledTimes(1);
    expect(invalidSpy).toHaveBeenLastCalledWith({
      values: {
        email: undefined,
        password: undefined,
      },
      errors: {
        email: expectedEmailError,
        password: expectedPasswordError,
      },
      evt: expect.anything(),
      results: {
        email: {
          valid: false,
          errors: [expectedEmailError],
        },
        password: {
          valid: false,
          errors: [expectedPasswordError],
        },
      },
    } as InvalidSubmissionContext);
    expect(validSpy).not.toHaveBeenCalled();
  });

  test('handles invalid submissions with submitForm', async () => {
    const invalidSpy = vi.fn();
    const validSpy = vi.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
          onInvalidSubmit: invalidSpy,
          onSubmit: validSpy,
        };
      },
      template: `
      <VForm v-slot="{ submitForm, errors }" :validationSchema="schema" @invalid-submit="onInvalidSubmit">
        <form @submit="submitForm">
            <Field id="email" name="email" />
            <span id="emailErr">{{ errors.email }}</span>

            <Field id="password" name="password" type="password" />
            <span id="passwordErr">{{ errors.password }}</span>

            <button>Submit</button>
        </form>
      </VForm>
    `,
    });

    const expectedEmailError = 'email is a required field';
    const expectedPasswordError = 'password is a required field';
    await flushPromises();
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(invalidSpy).toHaveBeenCalledTimes(1);
    expect(invalidSpy).toHaveBeenLastCalledWith({
      values: {
        email: undefined,
        password: undefined,
      },
      errors: {
        email: expectedEmailError,
        password: expectedPasswordError,
      },
      evt: expect.anything(),
      results: {
        email: {
          valid: false,
          errors: [expectedEmailError],
        },
        password: {
          valid: false,
          errors: [expectedPasswordError],
        },
      },
    } as InvalidSubmissionContext);
    expect(validSpy).not.toHaveBeenCalled();
  });

  // #3551
  test('resets checkboxes according to initial values', async () => {
    const wrapper = mountWithHoc({
      setup() {
        return {
          values: {
            terms: true,
            termsUnslotted: true,
            array: ['coffee', 'tea'],
          },
        };
      },
      template: `
      <VForm v-slot="{  resetForm }" :initial-values="values">
        <Field v-slot="{ field }" name="terms" type="checkbox" :value="true" :unchecked-value="false">
          <label>
            <input type="checkbox" name="terms" v-bind="field" :value="true" :unchecked-value="false" />
          </label>
        </Field>

        <Field name="termsUnslotted" type="checkbox" :value="true" :unchecked-value="false"></Field>

        <Field name="array" type="checkbox" value="coffee"></Field>
        <Field name="array" type="checkbox" value="tea"></Field>

        <button id="reset1" type="button" @click="resetForm()">Reset</button>
        <button id="reset2" type="button" @click="resetForm({ values: { terms: false, termsUnslotted: true, array: ['coffee'] } })">Reset</button>
      </VForm>
    `,
    });

    const inputAt = (idx: number) => wrapper.$el.querySelectorAll('input')[idx] as HTMLInputElement;
    expect(inputAt(0).checked).toBe(true);
    expect(inputAt(1).checked).toBe(true);
    expect(inputAt(2).checked).toBe(true);
    expect(inputAt(3).checked).toBe(true);

    dispatchEvent('#reset1', 'click');
    await flushPromises();
    expect(inputAt(0).checked).toBe(true);
    expect(inputAt(1).checked).toBe(true);
    expect(inputAt(2).checked).toBe(true);
    expect(inputAt(3).checked).toBe(true);

    dispatchEvent('#reset2', 'click');
    await flushPromises();
    expect(inputAt(0).checked).toBe(false);
    expect(inputAt(1).checked).toBe(true);
    expect(inputAt(2).checked).toBe(true);
    expect(inputAt(3).checked).toBe(false);
  });

  // #3895 #3894
  test('single checkbox component with v-model in a form', async () => {
    const value = ref(false);
    const Checkbox = defineComponent({
      props: { value: Boolean, modelValue: Boolean },
      template: `<input type="checkbox" @change="handleChange" :checked="checked" :value="true" />`,
      setup() {
        const { handleChange, checked } = useField('field', undefined, {
          type: 'checkbox',
          uncheckedValue: false,
          checkedValue: true,
          syncVModel: true,
        });

        return {
          handleChange,
          checked,
        };
      },
    });
    const wrapper = mountWithHoc({
      components: {
        Checkbox,
      },
      setup() {
        return {
          value,
        };
      },
      template: `
      <VForm>
        <Checkbox v-model="value" />
      </VForm>
    `,
    });

    await flushPromises();
    const inputAt = (idx: number) => wrapper.$el.querySelectorAll('input')[idx] as HTMLInputElement;
    expect(value.value).toBe(false);
    setChecked(inputAt(0), true);
    await flushPromises();
    expect(value.value).toBe(true);
  });

  test('resets a single field  resetField() to initial state in slot scope props', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ resetField }">
        <Field name="field" rules="required" v-slot="{ field, errors, meta }">
          <input type="text" v-bind="field">
          <span id="error">{{ errors && errors[0] }}</span>
          <span id="touched">{{ meta.touched }}</span>
          <button @click="resetField('field')" type="button">Reset</button>
        </Field>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const touched = wrapper.$el.querySelector('#touched');
    const input = wrapper.$el.querySelector('input');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    setValue(input, '123');
    dispatchEvent(input, 'blur');
    await flushPromises();
    expect(touched.textContent).toBe('true');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(error.textContent).toBe('');
    expect(input.value).toBe('');
    expect(touched.textContent).toBe('false');
  });

  test('resets a single field resetField() to specific state in slot scope props', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ resetField }">
        <Field name="field" rules="required" v-slot="{ field, errors, meta }">
          <input type="text" v-bind="field">
          <span id="error">{{ errors && errors[0] }}</span>
          <span id="touched">{{ meta.touched }}</span>
          <button @click="resetField('field', { value: 'test', touched: true })" type="button">Reset</button>
        </Field>
      </VForm>
    `,
    });

    const error = wrapper.$el.querySelector('#error');
    const touched = wrapper.$el.querySelector('#touched');
    const input = wrapper.$el.querySelector('input');

    expect(error.textContent).toBe('');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MESSAGE);
    setValue(input, '123');
    dispatchEvent(input, 'blur');
    await flushPromises();
    expect(touched.textContent).toBe('true');
    wrapper.$el.querySelector('button').click();
    await flushPromises();
    expect(error.textContent).toBe('');
    expect(input.value).toBe('test');
    expect(touched.textContent).toBe('true');
  });

  test('exposes values and meta with getValues and getMeta exposed APIs', async () => {
    const formRef = ref<InstanceType<typeof Form>>();
    const wrapper = mountWithHoc({
      template: `
      <VForm ref="formRef">
        <Field name="field" rules="required|min:3" />
      </VForm>
    `,
      setup() {
        return {
          formRef,
        };
      },
    });

    const input = wrapper.$el.querySelector('input');
    setValue(input, '1');
    dispatchEvent(input, 'blur');
    await flushPromises();

    expect(formRef.value?.getValues()).toEqual({ field: '1' });
    expect(formRef.value?.getMeta()).toEqual({
      touched: true,
      dirty: true,
      valid: false,
      pending: false,
      initialValues: {},
    });
    expect(formRef.value?.getErrors()).toEqual({ field: MIN_MESSAGE });
  });
});

// #3963
test('unmounted radio fields gets unregistered and their submitted values are kept if configured on the form level', async () => {
  let showFields!: Ref<boolean>;
  const spy = vi.fn();
  const wrapper = mountWithHoc({
    setup() {
      showFields = ref(true);

      return {
        showFields,
        onSubmit(values: any) {
          spy(values);
        },
      };
    },
    template: `
      <VForm @submit="onSubmit" v-slot="{ errors }" keep-values>
        <template v-if="showFields">
          <Field name="drink"  type="radio" value="" rules="required" /> Coffee
          <Field name="drink"  type="radio" value="Tea" rules="required" /> Tea
        </template>

        <Field name="drink"  type="radio" value="Coke" rules="required" /> Coke

        <span id="errors">{{ errors }}</span>

        <button>Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelector('#errors');
  const button = wrapper.$el.querySelector('button');
  const inputs = wrapper.$el.querySelectorAll('input');

  wrapper.$el.querySelector('button').click();
  await flushPromises();
  expect(errors.textContent).toBeTruthy();
  setChecked(inputs[1]);

  await flushPromises();
  button.click();
  await flushPromises();
  const expected = {
    drink: 'Tea',
  };
  expect(spy).toHaveBeenLastCalledWith(expected);

  showFields.value = false;
  await flushPromises();
  expect(errors.textContent).toBe('{}');
  button.click();
  await flushPromises();
  expect(spy).toHaveBeenLastCalledWith(expected);
});

// #3963
test('unmounted radio fields gets unregistered and their submitted values are removed', async () => {
  let showFields!: Ref<boolean>;
  const spy = vi.fn();
  const wrapper = mountWithHoc({
    setup() {
      showFields = ref(true);

      return {
        showFields,
        onSubmit(values: any) {
          spy(values);
        },
      };
    },
    template: `
      <VForm @submit="onSubmit" v-slot="{ errors }">
        <template v-if="showFields">
          <Field name="drink" type="radio" value="" /> Coffee
          <Field name="drink" type="radio" value="Tea" /> Tea
        </template>

        <Field name="drink"  type="radio" value="Coke" /> Coke

        <span id="errors">{{ errors }}</span>

        <button>Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelector('#errors');
  const button = wrapper.$el.querySelector('button');
  const inputs = wrapper.$el.querySelectorAll('input');

  wrapper.$el.querySelector('button').click();
  await flushPromises();
  expect(errors.textContent).toBeTruthy();
  setChecked(inputs[1]);

  await flushPromises();
  button.click();
  await flushPromises();
  expect(spy).toHaveBeenLastCalledWith({ drink: 'Tea' });

  showFields.value = false;
  await flushPromises();
  expect(errors.textContent).toBe('{}');
  button.click();
  await flushPromises();
  expect(spy).toHaveBeenLastCalledWith({});
});

// #3963
test('unmounted radio fields gets unregistered and their values are removed if configured on the field level', async () => {
  const showFields = ref(true);

  const wrapper = mountWithHoc({
    setup() {
      return {
        showFields,
      };
    },
    template: `
      <VForm v-slot="{ errors, values }" keep-values>
        <template v-if="showFields">
          <Field name="drink"  type="radio" value="" rules="required" /> Coffee
          <Field name="drink"  type="radio" value="Tea" rules="required" :keep-value="false" /> Tea
        </template>

        <Field name="drink"  type="radio" value="Coke" rules="required" /> Coke

        <span id="errors">{{ errors }}</span>
        <span id="values">{{ values }}</span>

        <button>Validate</button>
      </VForm>
    `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelector('#errors');
  const values = wrapper.$el.querySelector('#values');
  const inputs = wrapper.$el.querySelectorAll('input');

  wrapper.$el.querySelector('button').click();
  await flushPromises();
  expect(errors.textContent).toBeTruthy();
  setChecked(inputs[1]);

  await flushPromises();
  expect(JSON.parse(values.textContent)).toEqual({
    drink: 'Tea',
  });

  showFields.value = false;
  await flushPromises();
  // errors were cleared
  expect(errors.textContent).toBe('{}');
  expect(JSON.parse(values.textContent)).toEqual({});
});

// #4247
test('unmounted fields should not be validated when keep-values is on', async () => {
  let showFields!: Ref<boolean>;
  const spy = vi.fn();
  const wrapper = mountWithHoc({
    setup() {
      showFields = ref(true);

      return {
        showFields,
        onSubmit(values: any) {
          spy(values);
        },
      };
    },
    template: `
      <VForm @submit="onSubmit" v-slot="{ errors }" keep-values>
        <template v-if="showFields">
          <Field name="test" rules="required" />
        </template>

        <button>Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const button = wrapper.$el.querySelector('button');
  const inputs = wrapper.$el.querySelectorAll('input');

  wrapper.$el.querySelector('button').click();
  await flushPromises();
  setValue(inputs[0], '');

  showFields.value = false;
  await flushPromises();
  button.click();
  await flushPromises();
  const expected = {
    test: '',
  };
  expect(spy).toHaveBeenLastCalledWith(expected);
});

// #4308
test('radio fields with single field component binding', async () => {
  const submit = vi.fn();
  const model = ref('');
  const wrapper = mountWithHoc({
    setup() {
      return {
        onSubmit: submit,
        model,
      };
    },
    template: `
      <VForm @submit="onSubmit">
        <Field name="drink" type="radio" v-model="model" v-slot="{ field }">
          <input type="radio" value="Coffee" v-bind="field" />
          <input type="radio" value="Tea" v-bind="field" />
        </Field>

        <button>Submit</button>
      </VForm>
    `,
  });

  const inputs = wrapper.$el.querySelectorAll('input');
  const button = wrapper.$el.querySelector('button');

  wrapper.$el.querySelector('button').click();
  await flushPromises();

  setChecked(inputs[0]);
  await flushPromises();
  button.click();
  await flushPromises();
  expect(model.value).toBe('Coffee');
  expect(submit).toHaveBeenLastCalledWith({ drink: 'Coffee' }, expect.anything());
  setChecked(inputs[1]);
  await flushPromises();
  button.click();
  await flushPromises();
  expect(model.value).toBe('Tea');
  expect(submit).toHaveBeenLastCalledWith({ drink: 'Tea' }, expect.anything());
});

// #4643
test('removes proper pathState when field is unmounting', async () => {
  const renderTemplateField = ref(false);
  let form!: PrivateFormContext;

  mountWithHoc({
    template: `
      <form>
        <Field v-if="renderTemplateField" name="foo" rules="required" />
      </form>
    `,
    setup() {
      form = useForm() as unknown as PrivateFormContext;
      useField('foo');
      return { renderTemplateField };
    },
  });

  expect(form.meta.value.valid).toBe(true);
  expect(form.getAllPathStates()).toMatchObject([{ id: 0, path: 'foo' }]);

  renderTemplateField.value = true;
  await flushPromises();

  expect(form.meta.value.valid).toBe(false);
  expect(form.getAllPathStates()).toMatchObject([
    { id: 0, path: 'foo' },
    { id: 1, path: 'foo' },
  ]);

  renderTemplateField.value = false;
  await flushPromises();

  expect(form.meta.value.valid).toBe(true);
  expect(form.getAllPathStates()).toMatchObject([{ id: 0, path: 'foo' }]);
});
