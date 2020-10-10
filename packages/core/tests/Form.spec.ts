import flushPromises from 'flush-promises';
import { defineRule } from '@vee-validate/core';
import { mountWithHoc, setValue, setChecked } from './helpers';
import * as yup from 'yup';
import { onErrorCaptured, reactive, ref, Ref } from 'vue';

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
      <VForm :initialValues="initialValues" as="form">
        <Field rules="required" name="field" as="input" />

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const input = wrapper.$el.querySelector('input');

    expect(input.value).toBe(initialValues.field);
  });

  test('initial values can be reactive and will update non-dirty fields', async () => {
    let initialValues!: Record<string, any>;

    const wrapper = mountWithHoc({
      setup() {
        initialValues = reactive({
          field1: 'hello',
          field2: 'hi',
        });

        return {
          initialValues,
        };
      },
      template: `
      <VForm :initialValues="initialValues" as="form">
        <Field rules="required" name="field1" as="input" />
        <Field rules="required" name="field2" as="input" />

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const inputs = wrapper.$el.querySelectorAll('input');

    await flushPromises();
    setValue(inputs[0], '12');
    await flushPromises();
    initialValues.field1 = 'new';
    initialValues.field2 = 'tada';
    await flushPromises();

    // this was not updated because it was changed by user
    expect(inputs[0].value).not.toBe(initialValues.field1);

    // this is updated because it wasn't changed by user
    expect(inputs[1].value).toBe(initialValues.field2);
  });

  test('initial values can be refs and will update non-dirty fields', async () => {
    let initialValues!: Record<string, any>;

    const wrapper = mountWithHoc({
      setup() {
        initialValues = ref({
          field1: 'hello',
          field2: 'hi',
        });

        return {
          initialValues,
        };
      },
      template: `
      <VForm :initialValues="initialValues" as="form">
        <Field rules="required" name="field1" as="input" />
        <Field rules="required" name="field2" as="input" />

        <button id="submit">Submit</button>
      </VForm>
    `,
    });

    const inputs = wrapper.$el.querySelectorAll('input');

    await flushPromises();
    setValue(inputs[0], '12');
    await flushPromises();
    initialValues.value = {
      field1: 'new',
      field2: 'tada',
    };

    await flushPromises();

    // this was not updated because it was changed by user
    expect(inputs[0].value).not.toBe(initialValues.value.field1);

    // this is updated because it wasn't changed by user
    expect(inputs[1].value).toBe(initialValues.value.field2);
  });

  test('having no submit listener will submit the form natively', async () => {
    const submitMock = jest.fn();
    const wrapper = mountWithHoc({
      template: `
      <VForm as="form" v-slot="{ errors }">
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
        <VForm as="" v-slot="{ errors, submitForm }">
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
      <VForm as="form" :validationSchema="schema" v-slot="{ errors }">
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
      <VForm as="form" :validationSchema="schema" v-slot="{ errors }">
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
      <VForm as="form" :validationSchema="schema" v-slot="{ errors }">
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
        <Field name="drink" as="input" type="radio" value="" /> Coffee
        <Field name="drink" as="input" type="radio" value="Tea" /> Tea
        <Field name="drink" as="input" type="radio" value="Coke" /> Coke

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
            <Field name="test" as="input" type="radio" :value="value" /> {{value}}
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
    const initialValues = { test: { fieldOne: 'one' } };

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
            <Field name="test.fieldOne" as="input" type="radio" :value="value" /> {{value}}
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
    expect(result.value.fieldOne).toBe('two');
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
        <Field name="drink" as="input" type="checkbox" value="" /> Coffee
        <Field name="drink" as="input" type="checkbox" value="Tea" /> Tea
        <Field name="drink" as="input" type="checkbox" value="Coke" /> Coke

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
        <Field name="drink" as="input" type="checkbox" :value="true" /> Coffee

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

  // broken as of 3.0.0-rc.12 for some reason
  // FIXME: try to resolve values reactivity issues when removing attributes
  test.skip('unmounted fields gets unregistered and their values cleaned up', async () => {
    const showFields = ref(true);
    const wrapper = mountWithHoc({
      setup() {
        const schema = {
          field: 'required',
          drink: 'required',
        };

        return {
          schema,
          showFields,
        };
      },
      template: `
      <VForm @submit="submit" as="form" :validationSchema="schema" v-slot="{ errors, values }">
        <template v-if="showFields">
          <Field name="field" as="input" />          
          <Field name="nested.field" />
          <Field name="[non-nested.field]" />
          <Field name="drink" as="input" type="checkbox" value="" /> Coffee
          <Field name="drink" as="input" type="checkbox" value="Tea" /> Tea
        </template>
        <Field name="drink" as="input" type="checkbox" value="Coke" /> Coke

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
    const spy = jest.fn();
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
      <VForm @submit="onSubmit" as="form" v-slot="{ errors }">
        <template v-if="showFields">
          <Field name="field" as="input" rules="required" />          
          <Field name="nested.field" rules="required" />
          <Field name="[non-nested.field]" rules="required" />
          <Field name="drink" as="input" type="checkbox" value="" rules="required" /> Coffee
          <Field name="drink" as="input" type="checkbox" value="Tea" rules="required" /> Tea
        </template>
        <Field name="drink" as="input" type="checkbox" value="Coke" rules="required" /> Coke

        <span id="errors">{{ errors }}</span>

        <button>ValidSate</button>
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

  test('checkboxes with yup schema', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          drink: yup.array().required().min(1),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field name="drink" as="input" type="checkbox" value="" /> Coffee
        <Field name="drink" as="input" type="checkbox" value="Tea" /> Tea
        <Field name="drink" as="input" type="checkbox" value="Coke" /> Coke

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

  test('checkboxes v-model value syncing', async () => {
    let drinks!: Ref<string[]>;
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
          drink: yup.array().required(),
        });

        drinks = ref([]);

        return {
          schema,
          drinks,
        };
      },
      template: `
      <VForm :validation-schema="schema" v-slot="{ errors, values }">
        <Field v-model="drinks" name="drink" as="input" type="checkbox" value="" /> Coffee
        <Field v-model="drinks" name="drink" as="input" type="checkbox" value="Tea" /> Tea
        <Field v-model="drinks" name="drink" as="input" type="checkbox" value="Coke" /> Coke

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
    setChecked(inputs[1]);
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(drinks.value).toEqual(['Tea']);

    drinks.value = [];
    await flushPromises();
    expect(err.textContent).toBe('drink is a required field');
    expect(values.textContent).toBe('');

    drinks.value = ['Coke'];
    await flushPromises();
    expect(err.textContent).toBe('');
    expect(values.textContent).toBe(['Coke'].toString());
  });

  test('isSubmitting state', async () => {
    jest.useFakeTimers();

    let throws = false;
    const wrapper = mountWithHoc({
      setup() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onErrorCaptured(() => true);
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
      <VForm @submit="onSubmit" as="form" v-slot="{ isSubmitting }">

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
    jest.advanceTimersByTime(1001);
    await flushPromises();
    expect(submitting.textContent).toBe('false');

    throws = true;
    submit.click();
    await flushPromises();
    expect(submitting.textContent).toBe('true');
    jest.advanceTimersByTime(501);
    await flushPromises();
    expect(submitting.textContent).toBe('false');

    jest.useRealTimers();
  });

  test('aggregated meta reactivity', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm v-slot="{ meta }">
        <Field name="field" as="input" rules="required"  />

        <button :disabled="meta.invalid" id="submit">Submit</button>
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
    const fn = jest.fn();
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
        <Field name="user.name" as="input" rules="required"  />
        <Field name="user.addresses.0" as="input" id="address" rules="required"  />
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
    const fn = jest.fn();
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
        <Field name="user.name" as="input" />
        <span id="nameErr">{{ errors['user.name'] }}</span>
        <Field name="user.addresses[0]" as="input" id="address" />
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
    const fn = jest.fn();
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
        <Field name="[user.name]" as="input" rules="required"  />
        <Field name="[user.addresses.0]" as="input" id="address" rules="required"  />
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
        const schema = yup.object().shape({
          email: yup.string().required().email(),
          password: yup.string().required().min(8),
        });

        return {
          schema,
        };
      },
      template: `
      <VForm as="form" :validationSchema="schema" validateOnMount v-slot="{ errors }">
        <Field id="email" name="email" as="input" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" as="input" type="password" />
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
        <Field id="email" name="email" as="input" />
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
        <Field id="email" name="email" as="input" />
        <span id="emailErr">{{ errors.email }}</span>

        <Field id="password" name="password" as="input" type="password" />
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
        <Field id="email" name="email" as="input" />
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
        <Field id="email" name="email" as="input" />
        <Field id="password" name="password" as="input" />
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

  test('handles submit with handleSubmit and passing the event object', async () => {
    const spy = jest.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
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
          <Field id="email" name="email" as="input" />
          <span id="emailErr">{{ errors.email }}</span>

          <Field id="password" name="password" as="input" type="password" />
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
    const spy = jest.fn();
    const wrapper = mountWithHoc({
      setup() {
        const schema = yup.object().shape({
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
          <Field id="email" name="email" as="input" />
          <span id="emailErr">{{ errors.email }}</span>

          <Field id="password" name="password" as="input" type="password" />
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
});
