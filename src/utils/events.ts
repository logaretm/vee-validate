import { isCallable, toArray } from './index';

export const isEvent = (evt: any): evt is Event => {
  if (!evt) {
    return false;
  }

  if (typeof Event !== 'undefined' && isCallable(Event) && evt instanceof Event) {
    return true;
  }

  if (evt && evt.srcElement) {
    return true;
  }

  return false;
};

export const normalizeEvents = (evts: string | string[]) => {
  if (!evts) return [];

  return typeof evts === 'string' ? evts.split('|') : evts;
};

export function normalizeEventValue(value: unknown): any {
  if (!isEvent(value)) {
    return value;
  }

  const input = value.target as HTMLInputElement;
  if (input.type === 'file' && input.files) {
    return toArray(input.files);
  }

  return input.value;
}
