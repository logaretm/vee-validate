import { defineRule, useField, useForm } from 'vee-validate';
import { toTypedSchema } from '../src/toTypedSchema';
import { mountWithHoc, flushPromises, setValue } from 'vee-validate/tests/helpers';
import required from '../src/required';
import email from '../src/email';
import min from '../src/min';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

defineRule('required', (val: any) => (required(val) ? true : REQUIRED_MSG));
defineRule('email', (val: any) => (email(val) ? true : EMAIL_MSG));
defineRule('min', (val: any, params: any) => (min(val, params) ? true : MIN_MSG));

test('validates typed schema form with global rules', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toTypedSchema<{ email: string; password: string }>({
        email: 'required|email',
        password: 'required|min:8',
      });

      const { useFieldModel, errors } = useForm({
        validationSchema: schema,
        validateOnMount: true,
      });

      const [email, password] = useFieldModel(['email', 'password']);

      return {
        schema,
        email,
        password,
        errors,
      };
    },
    template: `
      <div>
        <input id="email" name="email" v-model="email" />
        <span id="emailErr">{{ errors.email }}</span>

        <input id="password" name="password" type="password" v-model="password" />
        <span id="passwordErr">{{ errors.password }}</span>
      </div>
    `,
  });

  const email = wrapper.$el.querySelector('#email');
  const password = wrapper.$el.querySelector('#password');
  const emailError = wrapper.$el.querySelector('#emailErr');
  const passwordError = wrapper.$el.querySelector('#passwordErr');

  await flushPromises();

  setValue(email, 'hello@');
  setValue(password, '1234');
  await flushPromises();

  expect(emailError.textContent).toBe(EMAIL_MSG);
  expect(passwordError.textContent).toBe(MIN_MSG);

  setValue(email, 'hello@email.com');
  setValue(password, '12346789');
  await flushPromises();

  expect(emailError.textContent).toBe('');
  expect(passwordError.textContent).toBe('');
});

test('validates typed field with global rules', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const rules = toTypedSchema<string>('required|min:8');
      const { value, errorMessage } = useField('test', rules);

      return {
        value,
        errorMessage,
      };
    },
    template: `
      <div>
          <input v-model="value" type="text">
          <p>{{ errorMessage }}</p>
      </div>
    `,
  });

  const input = wrapper.$el.querySelector('input');
  const error = wrapper.$el.querySelector('p');

  setValue(input, '');
  await flushPromises();
  expect(error.textContent).toBe(REQUIRED_MSG);
  setValue(input, '12');
  await flushPromises();
  expect(error.textContent).toBe(MIN_MSG);
  setValue(input, '12345678');
  await flushPromises();
  expect(error.textContent).toBe('');
});
