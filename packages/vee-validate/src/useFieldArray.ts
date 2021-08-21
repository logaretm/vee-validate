import { isNullOrUndefined } from '../../shared';
import { computed, DeepReadonly, Ref, unref } from 'vue';
import { FormContextKey } from './symbols';
import { MaybeRef } from './types';
import { getFromPath, injectWithSelf, warn } from './utils';

interface FieldArrayContext<TValue = unknown> {
  entries: DeepReadonly<Ref<TValue[]>>;
  remove(idx: number): TValue | undefined;
  push(value: TValue): void;
}

export function useFieldArray<TValue = unknown>(name: MaybeRef<string>): FieldArrayContext {
  const form = injectWithSelf(FormContextKey, undefined);
  const entries = computed(() => {
    const pathName = unref(name);

    return getFromPath<TValue[]>(form?.values, pathName, []) as TValue[];
  });

  if (!form) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noOp = () => {};
    warn(
      'FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly'
    );

    return {
      entries,
      remove: noOp,
      push: noOp,
    };
  }

  if (!unref(name)) {
    warn('FieldArray requires a field path to be provided, did you forget to pass the `name` prop?');
  }

  function remove(idx: number) {
    const pathName = unref(name);
    const pathValue = getFromPath<TValue[]>(form?.values, pathName);
    if (!pathValue || !Array.isArray(pathValue)) {
      return;
    }

    const newValue = [...pathValue];
    newValue.splice(idx, 1);
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
  }

  return {
    entries,
    remove,
    push,
  };
}
