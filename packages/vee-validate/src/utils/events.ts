import { hasCheckedAttr, isNativeMultiSelect, isEvent } from './assertions';
import { getBoundValue, hasValueBinding } from './vnode';

export function normalizeEventValue(value: Event | unknown): unknown {
  if (!isEvent(value)) {
    return value;
  }

  const input = value.target as HTMLInputElement;
  // Vue sets the current bound value on `_value` prop
  // for checkboxes it it should fetch the value binding type as is (boolean instead of string)
  if (hasCheckedAttr(input.type) && hasValueBinding(input)) {
    return getBoundValue(input);
  }

  if (input.type === 'file' && input.files) {
    return Array.from(input.files);
  }

  if (isNativeMultiSelect(input)) {
    return Array.from(input.options)
      .filter(opt => opt.selected && !opt.disabled)
      .map(getBoundValue);
  }

  return input.value;
}
