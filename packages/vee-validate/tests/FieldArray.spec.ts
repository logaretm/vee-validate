import flushPromises from 'flush-promises';
import { mountWithHoc, setValue, getValue, dispatchEvent } from './helpers';

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
        <FieldArray name="users" v-slot="{ remove, push, arrayValues: users }">
          <fieldset v-for="(user, idx) in users" :key="user.id">
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

        <FieldArray name="users" v-slot="{ remove, push, arrayValues: users }">
          <fieldset v-for="(user, idx) in users" :key="user.id">
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
