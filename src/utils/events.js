// @flow
import { isCallable } from './index';

export const isEvent = (evt: any): boolean => {
  return (typeof Event !== 'undefined' && isCallable(Event) && evt instanceof Event) || (evt && evt.srcElement);
};

export const normalizeEvents = (evts: string | string[]): string[] => {
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

export const addEventListener = (el: HTMLElement, eventName: string, cb: Function) => {
  el.addEventListener(eventName, cb, supportsPassive ? { passive: true } : false);
};
