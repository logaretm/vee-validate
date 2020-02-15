import { MaybeReactive } from '../types';
import { isRef } from 'vue';

export function unwrap<T>(value: MaybeReactive<T>) {
  return isRef(value) ? value.value : value;
}
