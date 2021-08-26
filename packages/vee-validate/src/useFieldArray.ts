import { DeepReadonly, Ref, unref, ref, watch, readonly } from 'vue';
import { isNullOrUndefined } from '../../shared';
import { FormContextKey } from './symbols';
import { MaybeRef } from './types';
import { getFromPath, injectWithSelf, warn } from './utils';

interface FieldEntry<TValue = unknown> {
  value: TValue;
  key: string | number;
}

interface FieldArrayContext<TValue = unknown> {
  entries: DeepReadonly<Ref<FieldEntry[]>>;
  remove(idx: number): TValue | undefined;
  push(value: TValue): void;
  swap(indexA: number, indexB: number): void;
}

export function useFieldArray<TValue = unknown>(name: MaybeRef<string>, keyPath: MaybeRef<string>): FieldArrayContext {
  const form = injectWithSelf(FormContextKey, undefined);
  const entries: Ref<FieldEntry<TValue>[]> = ref([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noOp = () => {};
  const noOpApi = {
    entries: readonly(entries),
    remove: noOp,
    push: noOp,
    swap: noOp,
  };

  if (!form) {
    warn(
      'FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly'
    );

    return noOpApi;
  }

  if (!unref(name)) {
    warn('FieldArray requires a field path to be provided, did you forget to pass the `name` prop?');

    return noOpApi;
  }

  function createEntry(value: TValue, keyFallback: number): FieldEntry<TValue> {
    const key = getFromPath<number | string>(value as any, unref(keyPath), keyFallback);

    return {
      key,
      value,
    };
  }

  watch(
    () => getFromPath<TValue[]>(form?.values, unref(name), []) as TValue[],
    values => {
      entries.value = values.map((value, idx) => createEntry(value, idx));
    },
    {
      immediate: true,
    }
  );

  function remove(idx: number) {
    const pathName = unref(name);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!pathValue || !Array.isArray(pathValue)) {
      return;
    }

    const newValue = [...pathValue];
    newValue.splice(idx, 1);
    entries.value.splice(idx, 1);
    form?.unsetInitialValue(pathName + `[${idx}]`);
    form?.setFieldValue(pathName, newValue);
  }

  function push(value: TValue) {
    const pathName = unref(name);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }

    const newValue = [...normalizedPathValue];
    newValue.push(value);
    form?.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form?.setFieldValue(pathName, newValue);
    entries.value.push(createEntry(value, entries.value.length));
  }

  function swap(indexA: number, indexB: number) {
    const pathName = unref(name);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!Array.isArray(pathValue) || !pathValue[indexA] || !pathValue[indexB]) {
      return;
    }

    const newValue = [...pathValue];
    // the old switcheroo
    const temp = newValue[indexA];
    newValue[indexA] = newValue[indexB];
    newValue[indexB] = temp;
    form?.setFieldValue(pathName, newValue);
  }

  return {
    entries: readonly(entries),
    remove,
    push,
    swap,
  };
}
