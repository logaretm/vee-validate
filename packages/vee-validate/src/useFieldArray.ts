import { Ref, unref, ref, computed, onBeforeUnmount } from 'vue';
import { isNullOrUndefined } from '../../shared';
import { FormContextKey } from './symbols';
import { FieldArrayContext, FieldEntry, MaybeRef, PrivateFieldArrayContext } from './types';
import { getFromPath, injectWithSelf, warn } from './utils';

export function useFieldArray<TValue = unknown>(arrayPath: MaybeRef<string>): FieldArrayContext<TValue> {
  const form = injectWithSelf(FormContextKey, undefined);
  const fields: Ref<FieldEntry<TValue>[]> = ref([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noOp = () => {};
  const noOpApi: FieldArrayContext<TValue> = {
    fields,
    remove: noOp,
    push: noOp,
    swap: noOp,
    insert: noOp,
    update: noOp,
    replace: noOp,
    prepend: noOp,
    move: noOp,
  };

  if (!form) {
    warn(
      'FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly'
    );

    return noOpApi;
  }

  if (!unref(arrayPath)) {
    warn('FieldArray requires a field path to be provided, did you forget to pass the `name` prop?');

    return noOpApi;
  }

  const alreadyExists = form.fieldArrays.find(a => unref(a.path) === unref(arrayPath));
  if (alreadyExists) {
    return alreadyExists as PrivateFieldArrayContext<TValue>;
  }

  let entryCounter = 0;
  function initFields() {
    const currentValues = getFromPath<TValue[]>(form?.values, unref(arrayPath), []) || [];
    fields.value = currentValues.map(createEntry);
    updateEntryFlags();
  }

  initFields();

  function updateEntryFlags() {
    const fieldsLength = fields.value.length;
    for (let i = 0; i < fieldsLength; i++) {
      const entry = fields.value[i];
      entry.isFirst = i === 0;
      entry.isLast = i === fieldsLength - 1;
    }
  }

  function createEntry(value: TValue): FieldEntry<TValue> {
    const key = entryCounter++;

    const entry: FieldEntry<TValue> = {
      key,
      value: computed<TValue>({
        get() {
          const currentValues = getFromPath<TValue[]>(form?.values, unref(arrayPath), []) || [];
          const idx = fields.value.findIndex(e => e.key === key);

          return idx === -1 ? value : currentValues[idx];
        },
        set(value: TValue) {
          const idx = fields.value.findIndex(e => e.key === key);
          if (idx === -1) {
            warn(`Attempting to update a non-existent array item`);
            return;
          }

          update(idx, value);
        },
      }) as any, // will be auto unwrapped
      isFirst: false,
      isLast: false,
    };

    return entry;
  }

  function remove(idx: number) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!pathValue || !Array.isArray(pathValue)) {
      return;
    }

    const newValue = [...pathValue];
    newValue.splice(idx, 1);
    form?.unsetInitialValue(pathName + `[${idx}]`);
    form?.setFieldValue(pathName, newValue);
    fields.value.splice(idx, 1);
    updateEntryFlags();
  }

  function push(value: TValue) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }

    const newValue = [...normalizedPathValue];
    newValue.push(value);
    form?.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form?.setFieldValue(pathName, newValue);
    fields.value.push(createEntry(value));
    updateEntryFlags();
  }

  function swap(indexA: number, indexB: number) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || !(indexA in pathValue) || !(indexB in pathValue)) {
      return;
    }

    const newValue = [...pathValue];
    const newFields = [...fields.value];

    // the old switcheroo
    const temp = newValue[indexA];
    newValue[indexA] = newValue[indexB];
    newValue[indexB] = temp;

    const tempEntry = newFields[indexA];
    newFields[indexA] = newFields[indexB];
    newFields[indexB] = tempEntry;

    form?.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }

  function insert(idx: number, value: TValue) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length < idx) {
      return;
    }

    const newValue = [...pathValue];
    const newFields = [...fields.value];

    newValue.splice(idx, 0, value);
    newFields.splice(idx, 0, createEntry(value));
    form?.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }

  function replace(arr: TValue[]) {
    const pathName = unref(arrayPath);
    form?.setFieldValue(pathName, arr);
    initFields();
  }

  function update(idx: number, value: TValue) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length - 1 < idx) {
      return;
    }
    form?.setFieldValue(`${pathName}[${idx}]`, value);
  }

  function prepend(value: TValue) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }

    const newValue = [value, ...normalizedPathValue];
    form?.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form?.setFieldValue(pathName, newValue);
    fields.value.unshift(createEntry(value));
    updateEntryFlags();
  }

  function move(oldIdx: number, newIdx: number) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    const newValue = isNullOrUndefined(pathValue) ? [] : [...pathValue];

    if (!Array.isArray(pathValue) || !(oldIdx in pathValue) || !(newIdx in pathValue)) {
      return;
    }

    const newFields = [...fields.value];

    const movedItem = newFields[oldIdx];
    newFields.splice(oldIdx, 1);
    newFields.splice(newIdx, 0, movedItem);

    const movedValue = newValue[oldIdx];
    newValue.splice(oldIdx, 1);
    newValue.splice(newIdx, 0, movedValue);

    form?.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }

  const fieldArrayCtx: FieldArrayContext<TValue> = {
    fields,
    remove,
    push,
    swap,
    insert,
    update,
    replace,
    prepend,
    move,
  };

  form.fieldArrays.push({
    path: arrayPath,
    reset: initFields,
    ...fieldArrayCtx,
  });

  onBeforeUnmount(() => {
    const idx = form.fieldArrays.findIndex(i => unref(i.path) === unref(arrayPath));
    if (idx >= 0) {
      form.fieldArrays.splice(idx, 1);
    }
  });

  return fieldArrayCtx;
}
