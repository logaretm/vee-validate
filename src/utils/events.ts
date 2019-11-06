import { isCallable, toArray, isNaN } from './index';

export const isEvent = (evt: any): evt is Event => {
  if (!evt) {
    return false;
  }

  if (typeof Event !== 'undefined' && isCallable(Event) && evt instanceof Event) {
    return true;
  }

  // this is for IE
  /* istanbul ignore next */
  if (evt && evt.srcElement) {
    return true;
  }

  return false;
};

type BoundInputElement = HTMLInputElement & {
  _vModifiers?: { number?: boolean; trim?: boolean };
};

export function normalizeEventValue(value: unknown): any {
  if (!isEvent(value)) {
    return value;
  }

  const input = value.target as BoundInputElement;
  if (input.type === 'file' && input.files) {
    return toArray(input.files);
  }

  // If the input has a `v-model.number` modifier applied.
  if (input._vModifiers?.number) {
    // as per the spec the v-model.number uses parseFloat
    const valueAsNumber = parseFloat(input.value);
    if (isNaN(valueAsNumber)) {
      return input.value;
    }

    return valueAsNumber;
  }

  if (input._vModifiers?.trim) {
    const trimmedValue = typeof input.value === 'string' ? input.value.trim() : input.value;

    return trimmedValue;
  }

  return input.value;
}
