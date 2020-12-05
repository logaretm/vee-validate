import { isCallable } from '../../../shared';
import { hasCheckedAttr } from './assertions';

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

export function normalizeEventValue(value: unknown): any {
  if (!isEvent(value)) {
    return value;
  }

  const input = value.target as HTMLInputElement;
  // Vue sets the current bound value on `_value` prop
  // for checkboxes it it should fetch the value binding type as is (boolean instead of string)
  if (hasCheckedAttr(input.type) && '_value' in input) {
    return (input as any)._value;
  }

  if (input.type === 'file' && input.files) {
    return Array.from(input.files);
  }

  return input.value;
}
