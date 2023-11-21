import { configure, defineRule } from '@/vee-validate';
import { dispatchEvent, flushPromises, mountWithHoc, setValue } from './helpers';
import { ref } from 'vue';

vi.useFakeTimers();

beforeEach(() => {
  configure({
    bails: true,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
    generateMessage: undefined,
  });
});

const updateValueWithEvents = (input: HTMLInputElement, value: any) => {
  setValue(input, value);
  dispatchEvent(input, 'change');
  dispatchEvent(input, 'blur');
};

describe('<FieldGroup />', () => {
  const REQUIRED_MESSAGE = `This field is required`;
  defineRule('required', (value: string) => {
    if (!value) {
      return REQUIRED_MESSAGE;
    }

    return true;
  });

  test('listens for input and blur events to set meta flags', async () => {
    const wrapper = mountWithHoc({
      template: `
      <div>
        <FieldGroup v-slot="{ meta }">
          <Field name="field" rules="required" v-slot="{ field }">
            <input v-bind="field" type="text">
            <pre id="pre">{{ meta }}</pre>
          </Field>
        </FieldGroup>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const pre = wrapper.$el.querySelector('pre');

    expect(pre.textContent).toContain('"touched": false');
    expect(pre.textContent).toContain('"dirty": false');
    dispatchEvent(input, 'blur');
    await flushPromises();
    expect(pre.textContent).toContain('"touched": true');
    expect(pre.textContent).toContain('"dirty": false');
    dispatchEvent(input, 'input');
    await flushPromises();
    expect(pre.textContent).toContain('"dirty": true');
  });

  test('aggregates validation state of multiple fields', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm>
        <FieldGroup v-slot="{ meta }">
          <Field name="field" rules="required" v-slot="{ field }">
            <input v-bind="field" type="text">
          </Field>
          <Field name="field2" rules="required" v-slot="{ field }">
            <input v-bind="field" type="text">
          </Field>
          <pre id="pre">{{ meta }}</pre>
        </FieldGroup>
      </VForm>
    `,
    });

    const inputs = wrapper.$el.querySelectorAll('input');
    const pre = wrapper.$el.querySelector('pre');

    await flushPromises();

    expect(pre.textContent).toContain('"valid": false');

    updateValueWithEvents(inputs[0], '1');
    await flushPromises();

    expect(pre.textContent).toContain('"valid": false');
    expect(pre.textContent).toContain('"touched": true');
    expect(pre.textContent).toContain('"dirty": true');

    updateValueWithEvents(inputs[1], '1');
    await flushPromises();

    expect(pre.textContent).toContain('"valid": true');
  });

  test('aggregates validation state of nested groups', async () => {
    const wrapper = mountWithHoc({
      template: `
      <VForm>
        <FieldGroup v-slot="{ meta }">
          <Field name="field" rules="required" v-slot="{ field }">
              <input v-bind="field" type="text">
            </Field>
          <FieldGroup v-slot="{ meta: nestedMeta }">
            <Field name="nestedField" rules="required" v-slot="{ field }">
              <input v-bind="field" type="text">
            </Field>
            <Field name="nestedField2" rules="required" v-slot="{ field }">
              <input v-bind="field" type="text">
            </Field>
            <pre id="nested-meta">{{ nestedMeta }}</pre>
          </FieldGroup>
          <pre id="parent-meta">{{ meta }}</pre>
        </FieldGroup>
        
      </VForm>
    `,
    });

    const inputs = wrapper.$el.querySelectorAll('input');
    const parentMeta = wrapper.$el.querySelector('#parent-meta');
    const nestedMeta = wrapper.$el.querySelector('#nested-meta');

    await flushPromises();

    expect(parentMeta.textContent).toContain('"valid": false');
    expect(nestedMeta.textContent).toContain('"valid": false');

    updateValueWithEvents(inputs[1], '1');
    updateValueWithEvents(inputs[2], '1');
    await flushPromises();

    expect(parentMeta.textContent).toContain('"valid": false');
    expect(nestedMeta.textContent).toContain('"valid": true');

    updateValueWithEvents(inputs[0], '1');
    await flushPromises();

    expect(parentMeta.textContent).toContain('"valid": true');
  });

  test('updates validation state of fields removal', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const rootFieldVisible = ref(true);
        const nestedFieldVisible = ref(true);

        return { rootFieldVisible, nestedFieldVisible };
      },
      template: `
      <VForm>
        <FieldGroup v-slot="{ meta }">
          <Field v-if="rootFieldVisible" name="field" rules="required" v-slot="{ field }">
              <input v-bind="field" type="text">
            </Field>
          <FieldGroup v-slot="{ meta: nestedMeta }">
              <Field v-if="nestedFieldVisible" name="nestedField" rules="required" v-slot="{ field }">
                <input v-bind="field" type="text">
              </Field>
            <pre id="nested-meta">{{ nestedMeta }}</pre>
          </FieldGroup>
          <pre id="parent-meta">{{ meta }}</pre>
          <button type="button" id="hide-root-field" @click="rootFieldVisible = false">Hide</button>
          <button type="button" id="hide-nested-field" @click="nestedFieldVisible = false">Hide</button>
        </FieldGroup>
      </VForm>
    `,
    });

    const parentMeta = wrapper.$el.querySelector('#parent-meta');
    const nestedMeta = wrapper.$el.querySelector('#nested-meta');
    const removeRootFieldButton = wrapper.$el.querySelector('#hide-root-field');
    const removeNestedFieldButton = wrapper.$el.querySelector('#hide-nested-field');

    await flushPromises();

    expect(parentMeta.textContent).toContain('"valid": false');
    expect(nestedMeta.textContent).toContain('"valid": false');

    removeNestedFieldButton.click();

    await flushPromises();

    expect(parentMeta.textContent).toContain('"valid": false');
    expect(nestedMeta.textContent).toContain('"valid": true');

    removeRootFieldButton.click();
    await flushPromises();

    expect(wrapper.$el.querySelectorAll('input')).toHaveLength(0);
    expect(parentMeta.textContent).toContain('"valid": true');
  });
});
