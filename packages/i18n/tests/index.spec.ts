import flushPromises from 'flush-promises';
import { defineRule, configure } from '@vee-validate/core';
import { required } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import { mountWithHoc, setValue } from '../../core/tests/helpers';

defineRule('required', required);

localize('en', {
  messages: {
    required: 'The {field} is required',
  },
});

test('can define new locales', async () => {
  configure({
    defaultMessage: localize('ar', {
      messages: {
        required: 'هذا الحقل مطلوب',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
      <div>
        <ValidationProvider name="field" immediate rules="required" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </ValidationProvider>
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
    defaultMessage: localize('en', {
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
          <ValidationProvider name="test" :immediate="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider name="name" :immediate="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
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
    defaultMessage: localize({
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
          <ValidationProvider name="field" :immediate="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
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
        <ValidationProvider name="field" rules="required|i18n" v-slot="{ field, errors }">
          <input v-bind="field" type="text">
          <span id="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
    `,
  });

  const error = wrapper.$el.querySelector('#error');
  const input = wrapper.$el.querySelector('input');
  setValue(input, '12');
  await flushPromises();

  expect(error.textContent).toContain('field is not valid');
});
