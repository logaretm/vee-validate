import {
  computed,
  getCurrentInstance,
  inject,
  InjectionKey,
  ref,
  Ref,
  warn as vueWarning,
  watch,
  nextTick,
  MaybeRefOrGetter,
  toValue,
} from 'vue';
import { klona as deepCopy } from 'klona/full';
import { isIndex, isNullOrUndefined, isObject, toNumber } from '../../../shared';
import { isContainerValue, isEmptyContainer, isEqual, isNotNestedPath } from './assertions';
import { GenericObject, MaybePromise } from '../types';
import { FormContextKey, FieldContextKey } from '../symbols';

export function cleanupNonNestedPath(path: string) {
  if (isNotNestedPath(path)) {
    return path.replace(/\[|\]/gi, '');
  }

  return path;
}

type NestedRecord = Record<string, unknown> | { [k: string]: NestedRecord };

/**
 * Gets a nested property value from an object
 */
export function getFromPath<TValue = unknown>(object: NestedRecord | undefined, path: string): TValue | undefined;
export function getFromPath<TValue = unknown, TFallback = TValue>(
  object: NestedRecord | undefined,
  path: string,
  fallback?: TFallback,
): TValue | TFallback;
export function getFromPath<TValue = unknown, TFallback = TValue>(
  object: NestedRecord | undefined,
  path: string,
  fallback?: TFallback,
): TValue | TFallback | undefined {
  if (!object) {
    return fallback;
  }

  if (isNotNestedPath(path)) {
    return object[cleanupNonNestedPath(path)] as TValue | undefined;
  }

  const resolvedValue = (path || '')
    .split(/\.|\[(\d+)\]/)
    .filter(Boolean)
    .reduce((acc, propKey) => {
      if (isContainerValue(acc) && propKey in acc) {
        return acc[propKey];
      }

      return fallback;
    }, object as unknown);

  return resolvedValue as TValue | undefined;
}

/**
 * Sets a nested property value in a path, creates the path properties if it doesn't exist
 */
export function setInPath(object: NestedRecord, path: string, value: unknown): void {
  if (isNotNestedPath(path)) {
    object[cleanupNonNestedPath(path)] = value;
    return;
  }

  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc: Record<string, unknown> = object;
  for (let i = 0; i < keys.length; i++) {
    // Last key, set it
    if (i === keys.length - 1) {
      acc[keys[i]] = value;
      return;
    }

    // Key does not exist, create a container for it
    if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
      // container can be either an object or an array depending on the next key if it exists
      acc[keys[i]] = isIndex(keys[i + 1]) ? [] : {};
    }

    acc = acc[keys[i]] as Record<string, unknown>;
  }
}

function unset(object: Record<string, unknown> | unknown[], key: string | number) {
  if (Array.isArray(object) && isIndex(key)) {
    object.splice(Number(key), 1);
    return;
  }

  if (isObject(object)) {
    delete object[key];
  }
}

/**
 * Removes a nested property from object
 */
export function unsetPath(object: NestedRecord, path: string): void {
  if (isNotNestedPath(path)) {
    delete object[cleanupNonNestedPath(path)];
    return;
  }

  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc: Record<string, unknown> = object;
  for (let i = 0; i < keys.length; i++) {
    // Last key, unset it
    if (i === keys.length - 1) {
      unset(acc, keys[i]);
      break;
    }

    // Key does not exist, exit
    if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
      break;
    }

    acc = acc[keys[i]] as Record<string, unknown>;
  }

  const pathValues: (unknown | Record<string, unknown>)[] = keys.map((_, idx) => {
    return getFromPath(object, keys.slice(0, idx).join('.'));
  });

  for (let i = pathValues.length - 1; i >= 0; i--) {
    if (!isEmptyContainer(pathValues[i])) {
      continue;
    }

    if (i === 0) {
      unset(object, keys[0]);
      continue;
    }

    unset(pathValues[i - 1] as Record<string, unknown>, keys[i - 1]);
  }
}

/**
 * A typed version of Object.keys
 */
export function keysOf<TRecord extends Record<string, unknown>>(record: TRecord): (keyof TRecord)[] {
  return Object.keys(record);
}

// Uses same component provide as its own injections
// Due to changes in https://github.com/vuejs/vue-next/pull/2424
export function injectWithSelf<T>(symbol: InjectionKey<T>, def: T | undefined = undefined): T | undefined {
  const vm = getCurrentInstance() as any;

  return vm?.provides[symbol as any] || inject(symbol, def);
}

export function warn(message: string) {
  vueWarning(`[vee-validate]: ${message}`);
}

export function resolveNextCheckboxValue<T>(currentValue: T, checkedValue: T, uncheckedValue: T): T;
export function resolveNextCheckboxValue<T>(currentValue: T[], checkedValue: T, uncheckedValue: T): T[];
export function resolveNextCheckboxValue<T>(currentValue: T | T[], checkedValue: T, uncheckedValue: T): T | T[] {
  if (Array.isArray(currentValue)) {
    const newVal = [...currentValue];
    // Use isEqual since checked object values can possibly fail the equality check #3883
    const idx = newVal.findIndex(v => isEqual(v, checkedValue));
    idx >= 0 ? newVal.splice(idx, 1) : newVal.push(checkedValue);

    return newVal;
  }

  return isEqual(currentValue, checkedValue) ? uncheckedValue : checkedValue;
}

// https://github.com/bameyrick/throttle-typescript
type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;

/**
 * Creates a throttled function that only invokes the provided function (`func`) at most once per within a given number of milliseconds
 * (`limit`)
 */
export function throttle<T extends (...args: any) => any>(func: T, limit: number): ThrottledFunction<T> {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: any[]): ReturnType<T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    if (!inThrottle) {
      inThrottle = true;

      setTimeout(() => (inThrottle = false), limit);

      lastResult = func.apply(context, args);
    }

    return lastResult;
  };
}

export function debounceAsync<TFunction extends (...args: any) => Promise<any>, TResult = ReturnType<TFunction>>(
  inner: TFunction,
  ms = 0,
): (...args: Parameters<TFunction>) => Promise<TResult> {
  let timer: number | null = null;
  let resolves: any[] = [];

  return function (...args: Parameters<TFunction>) {
    // Run the function after a certain amount of time
    if (timer) {
      clearTimeout(timer);
    }

    // @ts-expect-error timer is a number
    timer = setTimeout(() => {
      // Get the result of the inner function, then apply it to the resolve function of
      // each promise that has been created since the last time the inner function was run
      const result = inner(...(args as any));

      resolves.forEach(r => r(result));
      resolves = [];
    }, ms);

    return new Promise<TResult>(resolve => resolves.push(resolve));
  };
}

export function applyModelModifiers<TValue = unknown>(value: TValue, modifiers: unknown): TValue {
  if (!isObject(modifiers)) {
    return value;
  }

  if (modifiers.number) {
    return toNumber(value as string) as TValue;
  }

  return value;
}

export function withLatest<
  TFunction extends (...args: any[]) => Promise<any>,
  TResult = Awaited<ReturnType<TFunction>>,
>(fn: TFunction, onDone: (result: TResult, args: Parameters<TFunction>) => TResult) {
  let latestRun: Promise<TResult> | undefined;

  return async function runLatest(...args: Parameters<TFunction>) {
    const pending = fn(...args);
    latestRun = pending;
    const result = await pending;
    if (pending !== latestRun) {
      return result;
    }

    latestRun = undefined;

    return onDone(result, args);
  };
}

export function computedDeep<TValue = unknown>({ get, set }: { get(): TValue; set(value: TValue): void }): Ref<TValue> {
  const baseRef = ref(deepCopy(get())) as Ref<TValue>;

  watch(
    get,
    newValue => {
      if (isEqual(newValue, baseRef.value)) {
        return;
      }

      baseRef.value = deepCopy(newValue);
    },
    {
      deep: true,
    },
  );

  watch(
    baseRef,
    newValue => {
      if (isEqual(newValue, get())) {
        return;
      }

      set(deepCopy(newValue));
    },
    {
      deep: true,
    },
  );

  return baseRef;
}

export function normalizeErrorItem(message: string | string[] | null | undefined) {
  return Array.isArray(message) ? message : message ? [message] : [];
}

export function resolveFieldOrPathState(path?: MaybeRefOrGetter<string>) {
  const form = injectWithSelf(FormContextKey);
  const state = path ? computed(() => form?.getPathState(toValue(path))) : undefined;
  const field = path ? undefined : inject(FieldContextKey);

  if (!field && !state?.value) {
    if (__DEV__) {
      warn(`field with name ${toValue(path)} was not found`);
    }
  }

  return state || field;
}

export function omit<TObj extends GenericObject>(obj: TObj, keys: (keyof GenericObject)[]) {
  const target = {} as TObj;

  for (const key in obj) {
    if (!keys.includes(key)) {
      target[key] = obj[key];
    }
  }

  return target;
}

export function debounceNextTick<
  TFunction extends (...args: any[]) => MaybePromise<any>,
  TResult = ReturnType<TFunction>,
>(inner: TFunction): (...args: Parameters<TFunction>) => Promise<TResult> {
  let lastTick: Promise<any> | null = null;
  let resolves: any[] = [];

  return function (...args: Parameters<TFunction>) {
    // Run the function after a certain amount of time

    const thisTick = nextTick(() => {
      if (lastTick !== thisTick) {
        return;
      }

      // Get the result of the inner function, then apply it to the resolve function of
      // each promise that has been created since the last time the inner function was run
      const result = inner(...(args as any));

      resolves.forEach(r => r(result));
      resolves = [];
      lastTick = null;
    });

    lastTick = thisTick;

    return new Promise<TResult>(resolve => resolves.push(resolve));
  };
}
