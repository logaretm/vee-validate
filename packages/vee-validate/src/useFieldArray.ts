import { Ref, unref, ref, readonly, computed, onBeforeUnmount } from 'vue';
import { isNullOrUndefined } from '../../shared';
import { FormContextKey } from './symbols';
import { FieldArrayContext, FieldEntry, MaybeRef } from './types';
import { getFromPath, injectWithSelf, warn } from './utils';

interface FieldArrayOptions {
  name: MaybeRef<string>;
}

let FIELD_ARRAY_COUNTER = 0;
export function useFieldArray<TValue = unknown>(opts: FieldArrayOptions): FieldArrayContext<TValue> {
  const id = FIELD_ARRAY_COUNTER++;
  const form = injectWithSelf(FormContextKey, undefined);
  const fields: Ref<FieldEntry<TValue>[]> = ref([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noOp = () => {};
  const noOpApi = {
    fields: readonly(fields),
    remove: noOp,
    push: noOp,
    swap: noOp,
    insert: noOp,
  };

  if (!form) {
    warn(
      'FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly'
    );

    return noOpApi;
  }

  if (!unref(opts.name)) {
    warn('FieldArray requires a field path to be provided, did you forget to pass the `name` prop?');

    return noOpApi;
  }

  let entryCounter = 0;
  function initFields() {
    const currentValues = getFromPath<TValue[]>(form?.values, unref(opts.name), []);
    fields.value = currentValues.map(createEntry);
  }

  initFields();
  updateEntryFlags();

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

    const entry = {
      key,
      value: computed<TValue>(() => {
        const currentValues = getFromPath<TValue[]>(form?.values, unref(opts.name), []);
        const idx = fields.value.findIndex(e => e.key === key);

        return idx === -1 ? value : currentValues[idx];
      }),
      isFirst: false,
      isLast: false,
    };

    return entry;
  }

  function remove(idx: number) {
    const pathName = unref(opts.name);
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
    const pathName = unref(opts.name);
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
    const pathName = unref(opts.name);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || !pathValue[indexA] || !pathValue[indexB]) {
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
    const pathName = unref(opts.name);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length - 1 < idx) {
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

  form.fieldArraysLookup[id] = {
    reset: initFields,
  };

  onBeforeUnmount(() => {
    delete form.fieldArraysLookup[id];
  });

  return {
    fields: readonly(fields),
    remove,
    push,
    swap,
    insert,
  };
}
