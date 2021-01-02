import { mountWithHoc, setValue } from '../../vee-validate/tests/helpers';
import * as zod from 'zod';
import flushPromises from 'flush-promises';
import { toFieldValidator, toSchemaValidator } from '../src/index';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

test('validates field with zod', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const rules = toFieldValidator(zod.string().nonempty(REQUIRED_MSG).min(8, MIN_MSG));

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
  expect(error.textContent).toBe(REQUIRED_MSG);
  setValue(input, '12');
  await flushPromises();
  expect(error.textContent).toBe(MIN_MSG);
  setValue(input, '12345678');
  await flushPromises();
  expect(error.textContent).toBe('');
});

test.skip('validates form with zod', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toSchemaValidator(
        zod.object({
          email: zod.string().nonempty(REQUIRED_MSG).email(EMAIL_MSG),
          password: zod.string().nonempty(REQUIRED_MSG).min(8, MIN_MSG),
        })
      );

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

  expect(emailError.textContent).toBe(REQUIRED_MSG);
  expect(passwordError.textContent).toBe(REQUIRED_MSG);

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
