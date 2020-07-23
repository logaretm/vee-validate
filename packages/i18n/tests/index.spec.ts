import flushPromises from 'flush-promises';
import { defineRule, configure } from '@vee-validate/core';
import { required } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import { mountWithHoc, setValue } from '../../core/tests/helpers';

defineRule('required', required);

localize('en', {
  messages: {
    required: 'The {field} is required',
  },
});

test('can define new locales', async () => {
  configure({
    generateMessage: localize('ar', {
      messages: {
        required: 'هذا الحقل مطلوب',
      },
    }),
  });

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

  expect(error.textContent).toContain('هذا الحقل مطلوب');
});

test('can define specific messages for specific fields', async () => {
  configure({
    generateMessage: localize('en', {
      fields: {
        test: {
          required: 'WRONG!',
        },
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="test" :immediate="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="name" :immediate="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelectorAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors[0].textContent).toContain('WRONG!');
  expect(errors[1].textContent).toContain('The name is required');
});

test('can merge locales without setting the current one', async () => {
  configure({
    generateMessage: localize({
      ar: {
        messages: {
          required: 'هذا الحقل مطلوب',
        },
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="field" :immediate="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  const error = wrapper.$el.querySelector('#error');
  // flush the pending validation.
  await flushPromises();

  // locale wasn't set.
  expect(error.textContent).toContain('The field is required');
});

test('falls back to the default message if rule without message exists', async () => {
  defineRule('i18n', () => false);

  const wrapper = mountWithHoc({
    template: `
      <div>
        <Field name="field" rules="required|i18n" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </Field>
      </div>
    `,
  });

  const error = wrapper.$el.querySelector('#error');
  const input = wrapper.$el.querySelector('input');
  setValue(input, '12');
  await flushPromises();

  expect(error.textContent).toContain('field is not valid');
});

test('can switch between locales with setLocale', async () => {
  configure({
    generateMessage: localize({
      en: {
        messages: {
          required: 'This field is required',
        },
      },
      ar: {
        messages: {
          required: 'هذا الحقل مطلوب',
        },
      },
    }),
  });

  setLocale('en');

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

  expect(error.textContent).toContain('This field is required');
  setLocale('ar');
  setValue(wrapper.$el.querySelector('input'), '');

  await flushPromises();
  expect(error.textContent).toContain('هذا الحقل مطلوب');
});
