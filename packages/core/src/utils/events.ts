import { isCallable } from '../../../shared';

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
  if (input.type === 'file' && input.files) {
    return Array.from(input.files);
  }

  return input.value;
}
