import { Ref } from 'vue';
import { defineRule, configure, useField } from '@/vee-validate';
import { required, between } from '@/rules';
import { localize, setFallbackLocale, setLocale } from '@/i18n';
import { mountWithHoc, setValue, flushPromises } from '../../vee-validate/tests/helpers';

defineRule('required', required);
defineRule('between', between);

beforeEach(() => {
  localize('en', {
    messages: {
      required: 'The {field} is required',
    },
  });
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
        <Field name="field" validateOnMount rules="required" v-slot="{ field, errors }">
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
          <Field name="test" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="name" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
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

// #4097
test('can define specific messages for specific fields with labels', async () => {
  configure({
    generateMessage: localize('en', {
      fields: {
        test: {
          required: '{field} WRONG!',
        },
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="test" :validateOnMount="true" rules="required" v-slot="{ field, errors }" label="field">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="name" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelectorAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors[0].textContent).toContain('field WRONG!');
  expect(errors[1].textContent).toContain('The name is required');
});

// #4097
test('can define specific messages for specific fields with labels and form schema', async () => {
  configure({
    generateMessage: localize('en', {
      fields: {
        test: {
          required: '{field} WRONG!',
        },
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <VForm :validation-schema="schema">
          <Field name="test" :validateOnMount="true" v-slot="{ field, errors }" label="field">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="name" :validateOnMount="true" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </VForm>
      `,
    setup() {
      return {
        schema: {
          test: 'required',
          name: 'required',
        },
      };
    },
  });

  await flushPromises();
  const errors = wrapper.$el.querySelectorAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors[0].textContent).toContain('field WRONG!');
  expect(errors[1].textContent).toContain('The name is required');
});

test('can define labels or names for fields', async () => {
  configure({
    generateMessage: localize('en', {
      messages: { required: '{field} is required' },
      names: {
        first: 'First test',
        second: 'Second test',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="first" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="second" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelectorAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors[0].textContent).toContain('First test is required');
  expect(errors[1].textContent).toContain('Second test is required');
});

test('can define localized labels for fields', async () => {
  configure({
    generateMessage: localize('en', {
      messages: { required: '{field} is required' },
      names: {
        first: 'First test',
        second: 'Second test',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="first.value" label="first" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>

          <Field name="second.value" label="second" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
            <input v-bind="field" type="text">
            <span class="error">{{ errors[0] }}</span>
          </Field>
        </div>
      `,
  });

  await flushPromises();
  const errors = wrapper.$el.querySelectorAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors[0].textContent).toContain('First test is required');
  expect(errors[1].textContent).toContain('Second test is required');
});

// #4164
test('can define labels or names for fields with useField', async () => {
  let errorMessage!: Ref<string | undefined>;
  configure({
    generateMessage: localize('en', {
      messages: { required: '{field} is required' },
      names: {
        first: 'First test',
        second: 'Second test',
      },
    }),
  });

  mountWithHoc({
    setup() {
      const field = useField('first', 'required', { validateOnMount: true });
      errorMessage = field.errorMessage;
    },
    template: `
        <div>
        </div>
      `,
  });

  await flushPromises();
  expect(errorMessage.value).toBe('First test is required');
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
          <Field name="field" :validateOnMount="true" rules="required" v-slot="{ field, errors }">
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
        <Field name="name" rules="required|i18n" v-slot="{ field, errors }">
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

  expect(error.textContent).toContain('name is not valid');
});

test('falls back to a language specific default message if rule without message exists', async () => {
  defineRule('i18n', () => false);
  configure({
    generateMessage: localize('nl', {
      messages: {
        _default: '{field} is ongeldig',
      },
    }),
  });
  setLocale('nl');

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

  expect(error.textContent).toContain('field is ongeldig');
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
        <Field name="field" validateOnMount rules="required" v-slot="{ field, errors }">
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

test('interpolates object params with short format', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: `The {field} field must be between {min} and {max}`,
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('interpolates object params with extended format', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: `The {field} field must be between 0:{min} and 1:{max}`,
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('interpolates array params', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: 'The {field} field must be between 0:{min} and 1:{max}',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: [1, 10] }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('interpolates string params', async () => {
  configure({
    generateMessage: localize('en', {
      messages: {
        between: 'The {field} field must be between 0:{min} and 1:{max}',
      },
    }),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" rules="between:1,10" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

describe('interpolation preserves placeholders if not found', () => {
  test('array format', async () => {
    configure({
      generateMessage: localize('en', {
        messages: {
          between: 'The {field} field must be between 0:{min} and 1:{max}',
        },
      }),
    });

    const wrapper = mountWithHoc({
      template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: [1] }" v-slot="{ field, errors }">
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
    expect(error.textContent).toContain('The name field must be between 1 and 1:{max}');
  });

  test('object format', async () => {
    configure({
      generateMessage: localize('en', {
        messages: {
          between: 'The {field} field must be between 0:{min} and 1:{max}',
        },
      }),
    });

    const wrapper = mountWithHoc({
      template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 0 } }" v-slot="{ field, errors }">
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
    expect(error.textContent).toContain('The name field must be between 0 and {max}');
  });
});

// #4726 - custom interpolation options
test('custom interpolation options - interpolates object params with short format', async () => {
  configure({
    generateMessage: localize(
      'en',
      {
        messages: {
          between: `The {{field}} field must be between {{min}} and {{max}}`,
        },
      },
      {
        prefix: '{{',
        suffix: '}}',
      },
    ),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

// #4809
test('custom interpolation options - interpolates with long suffix/prefix', async () => {
  configure({
    generateMessage: localize(
      'en',
      {
        messages: {
          between: `The <start>field<end> field must be between <start>min<end> and <start>max<end>`,
        },
      },
      {
        prefix: '<start>',
        suffix: '<end>',
      },
    ),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('custom interpolation options - interpolates object params with short format and handlebars style interpolation', async () => {
  configure({
    generateMessage: localize(
      'en',
      {
        messages: {
          between: `The <%field%> field must be between <%min%> and <%max%>`,
        },
      },
      {
        prefix: '<%',
        suffix: '%>',
      },
    ),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('custom interpolation options - interpolates object params with extended format', async () => {
  configure({
    generateMessage: localize(
      'en',
      {
        messages: {
          between: `The {{field}} field must be between 0:{{min}} and 1:{{max}}`,
        },
      },
      {
        prefix: '{{',
        suffix: '}}',
      },
    ),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 1, max: 10 } }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('custom interpolation options - interpolates array params', async () => {
  configure({
    generateMessage: localize(
      'en',
      {
        messages: {
          between: 'The {{field}} field must be between 0:{{min}} and 1:{{max}}',
        },
      },
      {
        prefix: '{{',
        suffix: '}}',
      },
    ),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: [1, 10] }" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

test('custom interpolation options - interpolates string params', async () => {
  configure({
    generateMessage: localize(
      'en',
      {
        messages: {
          between: 'The {{field}} field must be between 0:{{min}} and 1:{{max}}',
        },
      },
      {
        prefix: '{{',
        suffix: '}}',
      },
    ),
  });

  const wrapper = mountWithHoc({
    template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" rules="between:1,10" v-slot="{ field, errors }">
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
  expect(error.textContent).toContain('The name field must be between 1 and 10');
});

describe('interpolation preserves placeholders if not found', () => {
  test('custom interpolation options - array format', async () => {
    configure({
      generateMessage: localize(
        'en',
        {
          messages: {
            between: 'The {{field}} field must be between 0:{{min}} and 1:{{max}}',
          },
        },
        {
          prefix: '{{',
          suffix: '}}',
        },
      ),
    });

    const wrapper = mountWithHoc({
      template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: [1] }" v-slot="{ field, errors }">
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
    expect(error.textContent).toContain('The name field must be between 1 and 1:{{max}}');
  });

  test('custom interpolation options - object format', async () => {
    configure({
      generateMessage: localize(
        'en',
        {
          messages: {
            between: 'The {{field}} field must be between 0:{{min}} and 1:{{max}}',
          },
        },
        {
          prefix: '{{',
          suffix: '}}',
        },
      ),
    });

    const wrapper = mountWithHoc({
      template: `
        <div>
          <Field name="name" value="-1" :validateOnMount="true" :rules="{ between: { min: 0 } }" v-slot="{ field, errors }">
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
    expect(error.textContent).toContain('The name field must be between 0 and {{max}}');
  });
});

test('can define fallback locale', async () => {
  configure({
    generateMessage: localize({
      en: {
        messages: {
          test: `Field is required`,
        },
      },
      ar: {
        messages: {},
      },
    }),
  });

  setLocale('ar');
  setFallbackLocale('en');
  defineRule('test', () => false);

  const wrapper = mountWithHoc({
    template: `
      <div>
        <Field name="name" rules="test" v-slot="{ field, errors }">
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

  expect(error.textContent).toContain('Field is required');
});
