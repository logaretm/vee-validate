import { isRef } from 'vue';
import { MaybeReactive } from '../types';

export function unwrap<T>(ref: MaybeReactive<T>) {
  return isRef(ref) ? ref.value : ref;
}
