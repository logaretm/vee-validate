import flushPromises from 'flush-promises';
import { mountWithHoc, setValue } from './helpers';

const DEFAULT_REQUIRED_MESSAGE = (name: string) => `The ${name} field is required`;

test('renders the as prop', () => {
  const wrapper = mountWithHoc({
    template: `
      <div>
        <ValidationObserver as="form" />
      </div>
    `,
  });

  expect(wrapper.$el.innerHTML).toBe(`<form novalidate=""></form>`);
});

test('observes the current state of providers', async () => {
  const wrapper = mountWithHoc({
    template: `
      <ValidationObserver as="form" v-slot="{ meta }">
        <ValidationProvider name="field" rules="required" as="input" type="text" />

        <span id="state">{{ meta.valid }}</span>
      </ValidationObserver>
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
      <ValidationObserver @submit="submit" as="form" v-slot="{ errors }">
        <ValidationProvider name="field" rules="required" as="input" />
        <span id="error">{{ errors.field }}</span>

        <button>Validate</button>
      </ValidationObserver>
    `,
  });

  const error = wrapper.$el.querySelector('#error');
  const input = wrapper.$el.querySelector('input');
  await flushPromises();
  expect(error.textContent).toBe('');

  wrapper.$el.querySelector('button').click();
  await flushPromises();
  expect(calls).toBe(0);

  expect(error.textContent).toBe(DEFAULT_REQUIRED_MESSAGE('field'));
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
      <ValidationObserver @reset="reset" as="form" v-slot="{ errors }">
        <ValidationProvider rules="required" name="field" as="input"/>
        <span id="error">{{ errors.field }}</span>

        <button id="submit">Validate</button>
        <button id="reset" type="reset">Reset</button>
      </ValidationObserver>
    `,
  });

  const error = wrapper.$el.querySelector('#error');
  expect(error.textContent).toBe('');

  wrapper.$el.querySelector('#submit').click();
  await flushPromises();

  expect(error.textContent).toBe(DEFAULT_REQUIRED_MESSAGE('field'));

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
      <ValidationObserver @submit="submit" as="form">
        <ValidationProvider rules="required" name="field" as="input" :disabled="disabled"/>

        <button id="submit">Submit</button>
      </ValidationObserver>
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
