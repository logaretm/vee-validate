import { Ref, unref, ref, onBeforeUnmount, watch, MaybeRefOrGetter, toValue } from 'vue';
import { klona as deepCopy } from 'klona/full';
import { isNullOrUndefined } from '../../shared';
import { FormContextKey } from './symbols';
import { FieldArrayContext, FieldEntry, PrivateFieldArrayContext, PrivateFormContext } from './types';
import { computedDeep, getFromPath, injectWithSelf, warn, isEqual, setInPath } from './utils';

export function useFieldArray<TValue = unknown>(arrayPath: MaybeRefOrGetter<string>): FieldArrayContext<TValue> {
  const form = injectWithSelf(FormContextKey, undefined) as PrivateFormContext;
  const fields: Ref<FieldEntry<TValue>[]> = ref([]);

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
    if (__DEV__) {
      warn(
        'FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly',
      );
    }

    return noOpApi;
  }

  if (!unref(arrayPath)) {
    if (__DEV__) {
      warn('FieldArray requires a field path to be provided, did you forget to pass the `name` prop?');
    }
    return noOpApi;
  }

  const alreadyExists = form.fieldArrays.find(a => unref(a.path) === unref(arrayPath));
  if (alreadyExists) {
    return alreadyExists as PrivateFieldArrayContext<TValue>;
  }

  let entryCounter = 0;

  function getCurrentValues() {
    return getFromPath<TValue[]>(form?.values, toValue(arrayPath), []) || [];
  }

  function initFields() {
    const currentValues = getCurrentValues();
    if (!Array.isArray(currentValues)) {
      return;
    }

    fields.value = currentValues.map((v, idx) => createEntry(v, idx, fields.value));
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

  function createEntry(value: TValue, idx?: number, currentFields?: FieldEntry<TValue>[]): FieldEntry<TValue> {
    // Skips the work by returning the current entry if it already exists
    // This should make the `key` prop stable and doesn't cause more re-renders than needed
    // The value is computed and should update anyways
    if (currentFields && !isNullOrUndefined(idx) && currentFields[idx]) {
      return currentFields[idx];
    }

    const key = entryCounter++;
    const entry: FieldEntry<TValue> = {
      key,
      value: computedDeep<TValue>({
        get() {
          const currentValues = getFromPath<TValue[]>(form?.values, toValue(arrayPath), []) || [];
          const idx = fields.value.findIndex(e => e.key === key);

          return idx === -1 ? value : currentValues[idx];
        },
        set(value: TValue) {
          const idx = fields.value.findIndex(e => e.key === key);
          if (idx === -1) {
            if (__DEV__) {
              warn(`Attempting to update a non-existent array item`);
            }
            return;
          }

          update(idx, value);
        },
      }) as TValue, // will be auto unwrapped
      isFirst: false,
      isLast: false,
    };

    return entry;
  }

  function afterMutation() {
    updateEntryFlags();
    // Should trigger a silent validation since a field may not do that #4096
    form?.validate({ mode: 'silent' });
  }

  function remove(idx: number) {
    const pathName = toValue(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!pathValue || !Array.isArray(pathValue)) {
      return;
    }

    const newValue = [...pathValue];
    newValue.splice(idx, 1);
    const fieldPath = pathName + `[${idx}]`;
    form.destroyPath(fieldPath);
    form.unsetInitialValue(fieldPath);
    setInPath(form.values, pathName, newValue);
    fields.value.splice(idx, 1);
    afterMutation();
  }

  function push(initialValue: TValue) {
    const value = deepCopy(initialValue);
    const pathName = toValue(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }

    const newValue = [...normalizedPathValue];
    newValue.push(value);
    form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    setInPath(form.values, pathName, newValue);
    fields.value.push(createEntry(value));
    afterMutation();
  }

  function swap(indexA: number, indexB: number) {
    const pathName = toValue(arrayPath);
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
    setInPath(form.values, pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }

  function insert(idx: number, initialValue: TValue) {
    const value = deepCopy(initialValue);
    const pathName = toValue(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length < idx) {
      return;
    }

    const newValue = [...pathValue];
    const newFields = [...fields.value];

    newValue.splice(idx, 0, value);
    newFields.splice(idx, 0, createEntry(value));
    setInPath(form.values, pathName, newValue);
    fields.value = newFields;
    afterMutation();
  }

  function replace(arr: TValue[]) {
    const pathName = toValue(arrayPath);
    form.stageInitialValue(pathName, arr);
    setInPath(form.values, pathName, arr);
    initFields();
    afterMutation();
  }

  function update(idx: number, value: TValue) {
    const pathName = toValue(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length - 1 < idx) {
      return;
    }

    setInPath(form.values, `${pathName}[${idx}]`, value);
    form?.validate({ mode: 'validated-only' });
  }

  function prepend(initialValue: TValue) {
    const value = deepCopy(initialValue);
    const pathName = toValue(arrayPath);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }

    const newValue = [value, ...normalizedPathValue];
    setInPath(form.values, pathName, newValue);
    form.stageInitialValue(pathName + `[0]`, value);
    fields.value.unshift(createEntry(value));
    afterMutation();
  }

  function move(oldIdx: number, newIdx: number) {
    const pathName = toValue(arrayPath);
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
    setInPath(form.values, pathName, newValue);
    fields.value = newFields;
    afterMutation();
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
    const idx = form.fieldArrays.findIndex(i => toValue(i.path) === toValue(arrayPath));
    if (idx >= 0) {
      form.fieldArrays.splice(idx, 1);
    }
  });

  // Makes sure to sync the form values with the array value if they go out of sync
  // #4153
  watch(getCurrentValues, formValues => {
    const fieldsValues = fields.value.map(f => f.value);
    // If form values are not the same as the current values then something overrode them.
    if (!isEqual(formValues, fieldsValues)) {
      initFields();
    }
  });

  return fieldArrayCtx;
}
