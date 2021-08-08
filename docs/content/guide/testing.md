---
title: Testing
description: Testing form validation in your apps
order: 8
---

# Testing

vee-validate has many tests of its own that cover almost every functionality, but if you find yourself needing to test vee-validate integration with your forms and fields, this guide should offer some guidance into the best practices and the caveats of doing that.

## Waiting for async validation

vee-validate does all of the work asynchronously. This means whenever you trigger a validation using explicit `validate()` calls or form submissions or `change` events, you still need to "flush" the promises to assert the state you expect.

For example, the following test will fail

```js
import { useField } from 'useField';

const SomeComponent = {
  template: `
    <input v-model="value" type="text">
    <span>{{ errorMessage }}</span>
  `,
  setup() {
    const { value, errorMessage } = useField('name', value => {
      return value ? true : 'field is required';
    });

    return {
      value,
      errorMessage,
    };
  },
};

test('it validates', async () => {
  // assuming you have a mounting helper
  mount(SomeComponent);
  const input = document.querySelector('input');
  input.value = '';
  input.dispatchEvent(new Event('change'));

  // ❌ Fails
  expect(document.querySelector('span').textContent).toBe('Field is required');
});
```

To wait for the validation to execute and render the error message, you can use the `flush-promises` npm package to wait for all promises to fulfill.

```js
import flushPromises from 'flush-promises';

test('it validates', async () => {
  // assuming you have a mounting helper
  mount(SomeComponent);
  const input = document.querySelector('input');
  input.value = '';
  input.dispatchEvent(new Event('change'));

  // wait for the promises to fulfill
  await flushPromises();
  // ✅ Now passes
  expect(document.querySelector('span').textContent).toBe('Field is required');
});
```

If you are using the official [Vue testing utils](https://next.vue-test-utils.vuejs.org/) which comes with the `flush-promises` exposed. You will need to flush promises after setting the input value:

```js
import { mount, flushPromises } from '@vue/test-utils';

test('it validates', async () => {
  const wrapper await mount(SomeComponent);
  await wrapper.get('input').setValue('');

  // wait for the promises to fulfill
  await flushPromises();
  // ✅  passes
  expect(wrapper.get('span').text()).toBe('Field is required');
});
```

## Testing error messages

Messages can change for the simplest of reasons, for example, grammar or punctuation changes could break your tests if you test against the literal contents of the message.

Ideally, you shouldn't rely on validation messages staying the same for your tests to pass, in any of the iterations when you work on your product you don't want your tests to fail just because of that.

So instead of testing the literal messages, you want to test if they get any kind of validation message regardless of their content. There are a few suggestions to remedy that:

### Testing message existence

You can test if the error field contains any message at all, this is useful if you rely on error messages from 3rd party, like the `@vee-validate/i18n` package which changes its messages frequently due to constant updates and fixes by the awesome contributors from all over the world.

```js
// ❌ Breaks easily
expect(errorElement.textContent).toBe('Field is required');

// ✅
expect(errorElement.textContent).toBeTruthy();
```

### Testing partial contents

Another approach is to test that the messages contain the critical information needed for the user to understand how to fix their input. This assumes you have some idea of the contents of the message:

```js
// ❌ Breaks easily
expect(errorElement.textContent).toBe('Field is required');

// ✅ use `toContain` or similar matching assertions
expect(errorElement.textContent).toContain('required');
```

Of course, this can break easily but still is more flexible than the full literal check.

### Testing actual contents

This approach relies on the fact that you organize your app user-facing strings in dictionary files, meaning messages are deterministic and not sprinkled across your component's code.

```js
import messages from 'strings/validation.js';

// ✅
expect(errorElement.textContent).toBe(messages.required);
```

## Mocking Form and Field Contexts

While this is extremely rare you may need to mock the `FormContext` object or the `FieldContext` object, one of the reasons is to unit test some component that relies on those objects being provided with the `provide/inject` API.

You can import the injection keys for those objects from vee-validate and manually inject your fields/forms.

```js
import { provide } from 'vue';
import { FormContextKey, FieldContextKey } from 'vee-validate';

provide(FormContextKey, MockedForm);
provide(FieldContextKey, MockedField);
```

To learn more about the mock details you should check the source code and see the typescript interfaces for [`FormContext`](https://github.com/logaretm/vee-validate/blob/main/packages/vee-validate/src/types.ts#L145) and [`FieldContext`](https://github.com/logaretm/vee-validate/blob/main/packages/vee-validate/src/types.ts#L66) objects and implement them as mocks.
