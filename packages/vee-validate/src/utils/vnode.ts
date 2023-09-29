import { SetupContext } from 'vue';

type HTMLElementWithValueBinding = HTMLElement & { _value: unknown };

export function normalizeChildren(
  tag: string | undefined | null,
  context: SetupContext<any>,
  slotProps: () => Record<string, unknown>,
) {
  if (!context.slots.default) {
    return context.slots.default;
  }

  if (typeof tag === 'string' || !tag) {
    return context.slots.default(slotProps());
  }

  return {
    default: () => context.slots.default?.(slotProps()),
  };
}

/**
 * Vue adds a `_value` prop at the moment on the input elements to store the REAL value on them, real values are different than the `value` attribute
 * as they do not get casted to strings unlike `el.value` which preserves user-code behavior
 */
export function getBoundValue(el: HTMLElement): unknown {
  if (hasValueBinding(el)) {
    return el._value;
  }

  return undefined;
}

/**
 * Vue adds a `_value` prop at the moment on the input elements to store the REAL value on them, real values are different than the `value` attribute
 * as they do not get casted to strings unlike `el.value` which preserves user-code behavior
 */
export function hasValueBinding(el: HTMLElement): el is HTMLElementWithValueBinding {
  return '_value' in el;
}
