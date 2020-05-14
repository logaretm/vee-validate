import { isRef, Ref, computed } from 'vue';
import { MaybeReactive } from '../types';

export function unwrap<T>(ref: MaybeReactive<T>) {
  return isRef(ref) ? ref.value : ref;
}

export function useRefsObjToComputed<TKey extends string, TValue>(refsObj: Record<TKey, Ref<TValue>>) {
  return computed(() => {
    return Object.keys(refsObj).reduce((acc, key) => {
      acc[key as TKey] = refsObj[key as TKey].value;

      return acc;
    }, {} as Record<TKey, TValue>);
  });
}
