import flushPromises from 'flush-promises';
import { localize, defineRule } from '@vee-validate/core';
import { mountWithHoc, setValue } from './helpers';

test('can define new locales', async () => {
  localize('ar', {
    messages: {
      required: 'هذا الحقل مطلوب',
    },
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
  localize('en', {
    fields: {
      test: {
        required: 'WRONG!',
      },
    },
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
  expect(errors[1].textContent).toContain('The name field is required');
});

test('can merge locales without setting the current one', async () => {
  localize({
    ar: {
      messages: {
        required: 'هذا الحقل مطلوب',
      },
    },
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
  expect(error.textContent).toContain('The field field is required');
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
