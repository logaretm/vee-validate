import { Form, defineRule, useField } from '@/vee-validate';
import { toRef, ref, defineComponent } from 'vue';
import * as yup from 'yup';
import { mountWithHoc, setValue, getValue, dispatchEvent, flushPromises } from './helpers';

const REQUIRED_MESSAGE = 'REQUIRED';

test('warns if no form is detected', async () => {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
    // NOOP
  });

  mountWithHoc({
    template: `
      <FieldArray name="users" />
    `,
  });

  await flushPromises();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('warns if no name path is provided', async () => {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
    // NOOP
  });

  mountWithHoc({
    template: `
      <VForm>
        <FieldArray />
      </VForm>
      `,
  });

  await flushPromises();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('adds items to the end of the array with push()', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [{ name: '111' }, { name: '222' }, { name: '333' }],
      };

      return {
        onSubmit,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues">
        <FieldArray name="users" v-slot="{ remove, push, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" />
            <ErrorMessage :name="'users[' + idx + '].name'" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>

          <button class="add" type="button" @click="push({ name: 'new' })">Add User +</button>
        </FieldArray>

        <button class="submit" type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const submitBtn = document.querySelector('.submit') as HTMLButtonElement;
  const inputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
  const removeBtn = document.querySelectorAll('.remove')[1] as HTMLButtonElement; // remove the second item
  setValue(inputs[0], '111');
  setValue(inputs[1], '222');
  setValue(inputs[2], '333');
  await flushPromises();
  removeBtn.click();
  await flushPromises();
  (submitBtn as HTMLButtonElement).click();
  await flushPromises();
  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [{ name: '111' }, { name: '333' }],
    }),
    expect.anything(),
  );

  dispatchEvent('.add', 'click');
  await flushPromises();
  (submitBtn as HTMLButtonElement).click();
  await flushPromises();
  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [{ name: '111' }, { name: '333' }, { name: 'new' }],
    }),
    expect.anything(),
  );
});

test('array fields should update their values when swapped', async () => {
  mountWithHoc({
    setup() {
      const initial = {
        users: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
          {
            name: 'third',
          },
        ],
      };

      return {
        initial,
      };
    },
    template: `
      <VForm :initial-values="initial">

        <FieldArray name="users" v-slot="{ remove, push, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <Field :id="\`name_\${idx}\`" :name="\`users[\${idx}].name\`" />
            <button :class="\`remove_\${idx}\`" type="button" @click="remove(idx)">X</button>
          </fieldset>

          <button class="add" type="button" @click="push({ name: '' })">Add User +</button>
        </FieldArray>

        <button type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  expect(document.querySelectorAll('input')).toHaveLength(3);
  dispatchEvent('.remove_0', 'click');
  await flushPromises();
  expect(document.querySelectorAll('input')).toHaveLength(2);
  expect(getValue('#name_0')).toBe('second');

  dispatchEvent('.add', 'click');
  await flushPromises();
  expect(document.querySelectorAll('input')).toHaveLength(3);
  expect(getValue('#name_2')).toBe('');
});

test('can swap array fields with swap helper', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const schema = yup.object({
        users: yup
          .array()
          .of(
            yup.object({
              name: yup.string().required(REQUIRED_MESSAGE),
            }),
          )
          .strict(),
      });

      const initial = {
        users: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
          {
            name: 'third',
          },
        ],
      };

      return {
        initial,
        schema,
        onSubmit,
      };
    },
    template: `
    <VForm @submit="onSubmit" :validation-schema="schema" :initial-values="initial">
      <FieldArray name="users" v-slot="{ swap, fields }">
          <div v-for="(field, idx) in fields" :key="field.key">
            <button class="up" @click="swap(idx, idx - 1)" type="button">⬆️</button>

            <Field :name="'users[' + idx + '].name'" />
            <ErrorMessage :class="'error-' + idx" :name="'users[' + idx + '].name'" />
          </div>
      </FieldArray>

      <button class="submit" type="submit">Submit</button>
    </VForm>
    `,
  });

  await flushPromises();
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const errorAt = (idx: number) => document.querySelector(`.error-${idx}`) as HTMLElement;
  const upButtonAt = (idx: number) => (document.querySelectorAll('.up') || [])[idx] as HTMLElement;
  const submitBtn = () => document.querySelector('.submit') as HTMLButtonElement;

  expect(getValue(inputAt(0))).toBe('first');
  expect(getValue(inputAt(1))).toBe('second');
  expect(getValue(inputAt(2))).toBe('third');

  setValue(inputAt(1), '');
  await flushPromises();
  expect(errorAt(1)?.textContent).toBe(REQUIRED_MESSAGE);

  upButtonAt(2).click();
  await flushPromises();
  expect(getValue(inputAt(1))).toBe('third');
  // undefined because it should be unmounted
  expect(errorAt(1)?.textContent).toBe(undefined);

  expect(getValue(inputAt(2))).toBe('');
  expect(errorAt(2)?.textContent).toBe(REQUIRED_MESSAGE);

  setValue(inputAt(2), 'edited');
  await flushPromises();

  submitBtn().click();
  await flushPromises();

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [
        {
          name: 'first',
        },
        {
          name: 'third',
        },
        {
          name: 'edited',
        },
      ],
    }),
    expect.anything(),
  );
});

test('fields have isFirst and isLast flags to help with conditions', async () => {
  mountWithHoc({
    setup() {
      const initial = {
        users: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
          {
            name: 'third',
          },
        ],
      };

      return {
        initial,
      };
    },
    template: `
    <VForm :initial-values="initial">
      <FieldArray name="users" v-slot="{ swap, fields, push, remove }">
          <div v-for="(field, idx) in fields" :key="field.key">
            <button class="up" @click="swap(idx, idx - 1)" :disabled="field.isFirst" type="button">⬆️</button>
            <button class="down" @click="swap(idx, idx + 1)" :disabled="field.isLast" type="button">⬇️</button>
            <button class="remove" type="button" @click="remove(idx)">X</button>


            <Field :name="'users[' + idx + '].name'" />
          </div>
          <button class="add" type="button" @click="push({ name: '' })">Add User +</button>
      </FieldArray>

    </VForm>
    `,
  });

  await flushPromises();
  const upButtonAt = (idx: number) => (document.querySelectorAll('.up') || [])[idx] as HTMLButtonElement;
  const downButtonAt = (idx: number) => (document.querySelectorAll('.down') || [])[idx] as HTMLButtonElement;
  const rmButtonAt = (idx: number) => (document.querySelectorAll('.remove') || [])[idx] as HTMLButtonElement;
  const addButton = () => document.querySelector('.add') as HTMLButtonElement;

  expect(upButtonAt(0).disabled).toBe(true);
  expect(upButtonAt(1).disabled).toBe(false);
  expect(upButtonAt(2).disabled).toBe(false);

  expect(downButtonAt(0).disabled).toBe(false);
  expect(downButtonAt(1).disabled).toBe(false);
  expect(downButtonAt(2).disabled).toBe(true);

  addButton().click();
  await flushPromises();

  expect(upButtonAt(0).disabled).toBe(true);
  expect(upButtonAt(1).disabled).toBe(false);
  expect(upButtonAt(2).disabled).toBe(false);
  expect(upButtonAt(3).disabled).toBe(false);

  expect(downButtonAt(0).disabled).toBe(false);
  expect(downButtonAt(1).disabled).toBe(false);
  expect(downButtonAt(2).disabled).toBe(false);
  expect(downButtonAt(3).disabled).toBe(true);

  rmButtonAt(2).click();
  await flushPromises();

  expect(upButtonAt(0).disabled).toBe(true);
  expect(upButtonAt(1).disabled).toBe(false);
  expect(upButtonAt(2).disabled).toBe(false);

  expect(downButtonAt(0).disabled).toBe(false);
  expect(downButtonAt(1).disabled).toBe(false);
  expect(downButtonAt(2).disabled).toBe(true);
});

test('can insert new items at specific index', async () => {
  mountWithHoc({
    setup() {
      const initial = {
        users: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
          {
            name: 'third',
          },
        ],
      };

      return {
        initial,
      };
    },
    template: `
    <VForm :initial-values="initial">
      <FieldArray name="users" v-slot="{ fields, insert }">
          <div v-for="(field, idx) in fields" :key="field.key">
            <Field :name="'users[' + idx + '].name'" />
          </div>
          <button class="insert" type="button" @click="insert(1, { name: 'inserted' })">Add User +</button>
      </FieldArray>
    </VForm>
    `,
  });

  await flushPromises();
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const insertButton = () => document.querySelector('.insert') as HTMLButtonElement;

  expect(getValue(inputAt(1))).toBe('second');
  expect(getValue(inputAt(2))).toBe('third');

  insertButton().click();
  await flushPromises();

  expect(getValue(inputAt(1))).toBe('inserted');
  expect(getValue(inputAt(2))).toBe('second');
  expect(getValue(inputAt(3))).toBe('third');
});

test('can replace all the items in the field array', async () => {
  mountWithHoc({
    setup() {
      const initial = {
        users: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
          {
            name: 'third',
          },
        ],
      };

      return {
        initial,
      };
    },
    template: `
    <VForm :initial-values="initial">
      <FieldArray name="users" v-slot="{ fields, replace }">
          <div v-for="(field, idx) in fields" :key="field.key">
            <Field :name="'users[' + idx + '].name'" />
          </div>
          <button class="replace" type="button" @click="replace([{ name: 'replaced' }])">Replace</button>
      </FieldArray>
    </VForm>
    `,
  });

  await flushPromises();
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const replaceButton = () => document.querySelector('.replace') as HTMLButtonElement;

  expect(getValue(inputAt(0))).toBe('first');
  expect(getValue(inputAt(1))).toBe('second');
  expect(getValue(inputAt(2))).toBe('third');

  replaceButton().click();
  await flushPromises();

  expect(getValue(inputAt(0))).toBe('replaced');
  expect(getValue(inputAt(1))).toBe(undefined);
  expect(getValue(inputAt(2))).toBe(undefined);
});

test('can update an item value at a given array index', async () => {
  mountWithHoc({
    setup() {
      const initial = {
        users: [
          {
            name: 'first',
          },
          {
            name: 'second',
          },
          {
            name: 'third',
          },
        ],
      };

      return {
        initial,
      };
    },
    template: `
    <VForm :initial-values="initial">
      <FieldArray name="users" v-slot="{ fields, update }">
          <div v-for="(field, idx) in fields" :key="field.key">
            <Field :name="'users[' + idx + '].name'" />
          </div>
          <button class="update" type="button" @click="update(1, { name: 'updated' })">Update</button>
      </FieldArray>
    </VForm>
    `,
  });

  await flushPromises();
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const updateButton = () => document.querySelector('.update') as HTMLButtonElement;

  expect(getValue(inputAt(1))).toBe('second');

  updateButton().click();
  await flushPromises();

  expect(getValue(inputAt(1))).toBe('updated');
});

test('can update an item value directly with .value setter', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const initial = {
        users: [
          {
            name: 'first',
          },
        ],
      };

      return {
        initial,
        onSubmit,
      };
    },
    template: `
    <VForm :initial-values="initial" @submit="onSubmit">
      <FieldArray name="users" v-slot="{ fields }">
          <div v-for="(field, idx) in fields" :key="field.key">
            <input v-model="fields[idx].value.name" />
          </div>
      </FieldArray>

      <button>Submit</button>
    </VForm>
    `,
  });

  await flushPromises();
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;

  expect(getValue(inputAt(0))).toBe('first');
  setValue(inputAt(0), 'updated');
  await flushPromises();
  expect(getValue(inputAt(0))).toBe('updated');
  document.querySelector('button')?.click();
  await flushPromises();

  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [
        {
          name: 'updated',
        },
      ],
    }),
    expect.anything(),
  );
});

test('adds items to the start of the array with prepend()', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [{ name: '111' }, { name: '222' }],
      };

      return {
        onSubmit,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues">
        <FieldArray name="users" v-slot="{ remove, prepend, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" />
            <ErrorMessage :name="'users[' + idx + '].name'" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>

          <button class="prepend" type="button" @click="prepend({ name: 'new' })">Add User +</button>
        </FieldArray>

        <button class="submit" type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const submitBtn = document.querySelector('.submit') as HTMLButtonElement;
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;

  expect(getValue(inputAt(0))).toBe('111');
  expect(getValue(inputAt(1))).toBe('222');
  dispatchEvent('.prepend', 'click');
  await flushPromises();
  expect(getValue(inputAt(0))).toBe('new');
  expect(getValue(inputAt(1))).toBe('111');
  expect(getValue(inputAt(2))).toBe('222');
  (submitBtn as HTMLButtonElement).click();
  await flushPromises();
  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [{ name: 'new' }, { name: '111' }, { name: '222' }],
    }),
    expect.anything(),
  );
});

// #3664
test('clears old errors path when item is removed when no form schema is present', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [{ name: '' }, { name: '' }, { name: '' }],
      };

      const schema = yup.string().required();

      return {
        onSubmit,
        schema,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues" v-slot="{ errors }">
        <FieldArray name="users" v-slot="{ remove, push, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" :rules="schema" />
            <ErrorMessage :name="'users[' + idx + '].name'" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>
        </FieldArray>


        <ul class="errors">
          <li v-for="error in errors">{{ error }}</li>
        </ul>

        <button class="submit" type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const submitBtn = document.querySelector('.submit') as HTMLButtonElement;
  const errorList = document.querySelector('ul') as HTMLUListElement;
  const removeBtnAt = (idx: number) => document.querySelectorAll('.remove')[idx] as HTMLButtonElement; // remove the second item

  submitBtn.click();
  await flushPromises();
  expect(errorList.children).toHaveLength(3);
  removeBtnAt(1).click();
  await flushPromises();

  expect(errorList.children).toHaveLength(2);
});

// #3748
test('clears old errors path when last item is removed and value update validation is on', async () => {
  const onSubmit = vi.fn();
  defineRule('required', (v: any) => (v ? true : REQUIRED_MESSAGE));
  const InputField = defineComponent({
    props: {
      rules: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      label: String,
      type: { type: String, default: 'text' },
    },
    setup(props) {
      const { value, handleChange, errors } = useField(toRef(props, 'name'), props.rules, {
        label: props.label,
        type: props.type as 'checkbox',
      });

      return {
        value,
        errors,
        handleChange,
      };
    },
    template: `
      <label :for="name">{{ label }}</label>
      <input :type="type" :name="name" :value="value" @input="handleChange" />
      <span>{{ errors[0] }}</span>
      `,
  });

  mountWithHoc({
    components: {
      InputField,
    },
    setup() {
      const initialValues = {
        users: ['first', 'second', 'third'],
      };

      const schema = yup.string().required();

      return {
        onSubmit,
        schema,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues" v-slot="{ errors }">
        <FieldArray name="users" v-slot="{ remove, push, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <InputField :name="'users[' + idx + ']'" rules="required" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>
        </FieldArray>


        <ul class="errors">
          <li v-for="error in errors">{{ error }}</li>
        </ul>

        <button class="submit" type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const submitBtn = document.querySelector('.submit') as HTMLButtonElement;
  const errorList = document.querySelector('ul') as HTMLUListElement;
  const removeBtnAt = (idx: number) => document.querySelectorAll('.remove')[idx] as HTMLButtonElement; // remove the second item

  submitBtn.click();
  await flushPromises();
  expect(errorList.children).toHaveLength(0);
  removeBtnAt(2).click();
  await flushPromises();

  expect(errorList.children).toHaveLength(0);
});

// 4017
test('keeps the errors intact if an item was removed in the middle of the list', async () => {
  defineRule('required', (v: any) => (v ? true : REQUIRED_MESSAGE));
  const InputField = defineComponent({
    props: {
      rules: {
        type: null,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      label: String,
      type: { type: String, default: 'text' },
    },
    setup(props) {
      const { value, handleChange, errors } = useField(toRef(props, 'name'), props.rules, {
        label: props.label,
      });

      return {
        value,
        errors,
        handleChange,
      };
    },
    template: `
      <label :for="name">{{ label }}</label>
      <input :type="type" :name="name" :value="value" @input="handleChange" />
      <span>{{ errors[0] }}</span>
      `,
  });

  mountWithHoc({
    components: {
      InputField,
    },
    setup() {
      const initialValues = {
        users: ['', '', ''],
      };

      const schema = yup.string().required();

      return {
        schema,
        initialValues,
      };
    },
    template: `
      <VForm :initial-values="initialValues" v-slot="{ errors }">
        <FieldArray name="users" v-slot="{ remove, push, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <InputField :name="'users[' + idx + ']'" :rules="schema" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>
        </FieldArray>


        <ul class="errors">
          <li v-for="error in errors">{{ error }}</li>
        </ul>

        <button class="submit" type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const errorList = document.querySelector('ul') as HTMLUListElement;
  const removeBtnAt = (idx: number) => document.querySelectorAll('.remove')[idx] as HTMLButtonElement; // remove the second item

  await flushPromises();
  expect(errorList.children).toHaveLength(0);
  removeBtnAt(1).click();
  await flushPromises();

  expect(errorList.children).toHaveLength(0);
});

test('moves items around the array with move()', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
      };

      return {
        onSubmit,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues">
        <FieldArray name="users" v-slot="{ move, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" />
            <ErrorMessage :name="'users[' + idx + '].name'" />

            <button class="move" type="button" @click="move(idx, 0)">Move</button>
          </fieldset>
        </FieldArray>

        <button class="submit" type="submit">Submit</button>
      </VForm>
    `,
  });

  await flushPromises();
  const submitBtn = document.querySelector('.submit') as HTMLButtonElement;
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const moveElAt = (idx: number) => (document.querySelectorAll('.move') || [])[idx] as HTMLInputElement;

  expect(getValue(inputAt(0))).toBe('1');
  expect(getValue(inputAt(1))).toBe('2');
  expect(getValue(inputAt(2))).toBe('3');
  expect(getValue(inputAt(3))).toBe('4');
  dispatchEvent(moveElAt(3), 'click');
  await flushPromises();
  expect(getValue(inputAt(0))).toBe('4');
  expect(getValue(inputAt(1))).toBe('1');
  expect(getValue(inputAt(2))).toBe('2');
  expect(getValue(inputAt(3))).toBe('3');
  (submitBtn as HTMLButtonElement).click();
  await flushPromises();
  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [{ name: '4' }, { name: '1' }, { name: '2' }, { name: '3' }],
    }),
    expect.anything(),
  );
});

// #3782
test('removing an item marks the form as dirty', async () => {
  const onSubmit = vi.fn();
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [{ name: '1' }, { name: '2' }, { name: '3' }],
      };

      return {
        onSubmit,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues" v-slot="{ meta }">
        <FieldArray name="users" v-slot="{ remove, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>
        </FieldArray>

        <pre>{{ meta.dirty }}</pre>
      </VForm>
    `,
  });

  await flushPromises();
  const getDirtyPre = () => document.querySelector('pre') as HTMLElement;
  const removeBtnAt = (idx: number) => (document.querySelectorAll('.remove') || [])[idx] as HTMLInputElement;

  await expect(getDirtyPre().textContent).toBe('false');
  dispatchEvent(removeBtnAt(2), 'click');
  await flushPromises();

  await expect(getDirtyPre().textContent).toBe('true');
});

test('clean up form registration on unmount', async () => {
  const shown = ref(true);
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [{ name: '1' }, { name: '2' }, { name: '3' }],
      };

      return {
        initialValues,
        shown,
      };
    },
    template: `
      <VForm :initial-values="initialValues">
        <FieldArray v-if="shown" name="users" v-slot="{ remove, fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" />

          </fieldset>
        </FieldArray>
      </VForm>
    `,
  });

  await flushPromises();
  shown.value = false;
  await flushPromises();
  expect(1).toBe(1);
});

// #3874
test('adding or removing fields should update form dirty correctly', async () => {
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [''],
      };

      return {
        initialValues,
      };
    },
    template: `
      <VForm v-slot="{ meta }" :initial-values="initialValues">
        <FieldArray name="users" v-slot="{ remove, fields, push }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + ']'" />

            </fieldset>
            <button id="push" type="button" @click="push('')"></button>
            <button id="remove"  type="button"  @click="remove(1)"></button>
        </FieldArray>

        <pre id="dirty">{{ meta.dirty }}</pre>
      </VForm>
    `,
  });

  await flushPromises();
  const pushBtn = document.querySelector('#push') as HTMLElement;
  const removeBtn = document.querySelector('#remove') as HTMLElement;
  const dirty = document.querySelector('#dirty') as HTMLElement;

  expect(dirty?.textContent).toBe('false');
  pushBtn.click();
  await flushPromises();
  expect(dirty.textContent).toBe('true');
  removeBtn.click();
  await flushPromises();
  expect(dirty.textContent).toBe('false');
});

// #4115
test('removing fields with `v-if` should clean up their state properly', async () => {
  const showFields = ref(true);
  const formRef = ref<InstanceType<typeof Form>>();
  const initialValues = {
    users: [
      { name: 'test 1', amount: 123 },
      { name: 'test 2', amount: 567 },
    ],
  };
  mountWithHoc({
    setup() {
      return {
        initialValues,
        formRef,
        showFields,
      };
    },
    template: `
      <VForm ref="formRef" :initial-values="initialValues">
        <FieldArray name="users" v-slot="{ fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <legend>User #{{ idx }}</legend>
            <template v-if="showFields">
              <Field :name="'users[' + idx + '].name'" />
              <Field :name="'users[' + idx + '].amount'" />
            </template>
          </fieldset>
        </FieldArray>

      </VForm>
    `,
  });

  await flushPromises();
  expect(formRef.value?.getValues()).toEqual(initialValues);
  showFields.value = false;
  await flushPromises();
  expect(formRef.value?.getValues()).toEqual({});
});
