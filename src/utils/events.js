import { isCallable, toArray } from './index';

export const isEvent = (evt) => {
  return (typeof Event !== 'undefined' && isCallable(Event) && evt instanceof Event) || (evt && evt.srcElement);
};

export const normalizeEvents = (evts) => {
  if (!evts) return [];

  return (typeof evts === 'string' ? evts.split('|') : evts);
};

let supportsPassive = true;

export const detectPassiveSupport = () => {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get () {
        supportsPassive = true;
      }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {
    supportsPassive = false;
  };

  return supportsPassive;
};

export const addEventListener = (el, eventName, handler) => {
  el.addEventListener(eventName, handler, supportsPassive ? { passive: true } : false);

  return () => {
    el.removeEventListener(eventName, handler);
  };
};

export function normalizeEventValue (value) {
  if (isEvent(value)) {
    return value.target.type === 'file' ? toArray(value.target.files) : value.target.value;
  }

  return value;
}
