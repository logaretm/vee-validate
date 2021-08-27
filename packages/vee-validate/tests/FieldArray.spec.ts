import * as yup from 'yup';
import { mountWithHoc, setValue, getValue, dispatchEvent, flushPromises } from './helpers';

const REQUIRED_MESSAGE = 'REQUIRED';

test('warns if no form is detected', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();

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
  const spy = jest.spyOn(console, 'warn').mockImplementation();

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

// #3325
test('un-sets old path value when array fields are removed', async () => {
  const onSubmit = jest.fn();
  mountWithHoc({
    setup() {
      const initialValues = {
        users: [
          { id: 1, name: '111' },
          { id: 2, name: '222' },
          { id: 3, name: '333' },
        ],
      };

      return {
        onSubmit,
        initialValues,
      };
    },
    template: `
      <VForm @submit="onSubmit" :initial-values="initialValues">
        <FieldArray name="users" key-path="id" v-slot="{ remove, push, entries }">
          <fieldset v-for="(entry, idx) in entries" :key="entry.key">
            <legend>User #{{ idx }}</legend>
            <label :for="'name_' + idx">Name</label>
            <Field :id="'name_' + idx" :name="'users[' + idx + '].name'" />
            <ErrorMessage :name="'users[' + idx + '].name'" />

            <button class="remove" type="button" @click="remove(idx)">X</button>
          </fieldset>  

          <button class="add" type="button" @click="push({ id: 4, name: 'new' })">Add User +</button>
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
      users: [
        { id: 1, name: '111' },
        { id: 3, name: '333' },
      ],
    }),
    expect.anything()
  );

  dispatchEvent('.add', 'click');
  await flushPromises();
  (submitBtn as HTMLButtonElement).click();
  await flushPromises();
  expect(onSubmit).toHaveBeenLastCalledWith(
    expect.objectContaining({
      users: [
        { id: 1, name: '111' },
        { id: 3, name: '333' },
        { id: 4, name: 'new' },
      ],
    }),
    expect.anything()
  );
});

// #3325 but with initial values
test('array fields should update their values when swapped', async () => {
  mountWithHoc({
    setup() {
      let id = 1;

      const initial = {
        users: [
          {
            id: id++,
            name: 'first',
          },
          {
            id: id++,
            name: 'second',
          },
          {
            id: id++,
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

        <FieldArray name="users" key-path="id" v-slot="{ remove, push, entries }">
          <fieldset v-for="(entry, idx) in entries" :key="entry.key">
            <Field :id="\`name_\${idx}\`" :name="\`users[\${idx}].name\`" />
            <button :class="\`remove_\${idx}\`" type="button" @click="remove(idx)">X</button>
          </fieldset>

          <button class="add" type="button" @click="push({ id: Date.now(), name: '' })">Add User +</button>
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
  const onSubmit = jest.fn();
  mountWithHoc({
    setup() {
      let id = 1;
      const schema = yup.object({
        users: yup
          .array()
          .of(
            yup.object({
              name: yup.string().required(REQUIRED_MESSAGE),
            })
          )
          .strict(),
      });

      const initial = {
        users: [
          {
            id: id++,
            name: 'first',
          },
          {
            id: id++,
            name: 'second',
          },
          {
            id: id++,
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
      <FieldArray name="users" key-path="id" v-slot="{ swap, entries }">
          <div v-for="(entry, idx) in entries" :key="entry.key">
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
          id: 1,
          name: 'first',
        },
        {
          id: 3,
          name: 'third',
        },
        {
          id: 2,
          name: 'edited',
        },
      ],
    }),
    expect.anything()
  );
});

test('entries have isFirst and isLast flags to help with conditions', async () => {
  mountWithHoc({
    setup() {
      let id = 1;
      const initial = {
        users: [
          {
            id: id++,
            name: 'first',
          },
          {
            id: id++,
            name: 'second',
          },
          {
            id: id++,
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
      <FieldArray name="users" key-path="id" v-slot="{ swap, entries, push, remove }">
          <div v-for="(entry, idx) in entries" :key="entry.key">
            <button class="up" @click="swap(idx, idx - 1)" :disabled="entry.isFirst" type="button">⬆️</button>
            <button class="down" @click="swap(idx, idx + 1)" :disabled="entry.isLast" type="button">⬇️</button>
            <button class="remove" type="button" @click="remove(idx)">X</button>


            <Field :name="'users[' + idx + '].name'" />
          </div>
          <button class="add" type="button" @click="push({ id: Date.now(), name: '' })">Add User +</button>
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
      let id = 1;
      const initial = {
        users: [
          {
            id: id++,
            name: 'first',
          },
          {
            id: id++,
            name: 'second',
          },
          {
            id: id++,
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
      <FieldArray name="users" key-path="id" v-slot="{ entries, insert }">
          <div v-for="(entry, idx) in entries" :key="entry.key">
            <Field :name="'users[' + idx + '].name'" />
          </div>
          <button class="insert" type="button" @click="insert(1, { id: Date.now(), name: 'inserted' })">Add User +</button>
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
