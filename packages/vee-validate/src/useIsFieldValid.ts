import { computed, MaybeRef } from 'vue';
import { resolveFieldOrPathState } from './utils';

/**
 * If a field is validated and is valid
 */
export function useIsFieldValid(path?: MaybeRef<string>) {
  const fieldOrPath = resolveFieldOrPathState(path);

  return computed(() => {
    if (!fieldOrPath) {
      return false;
    }

    return ('meta' in fieldOrPath ? fieldOrPath.meta.valid : fieldOrPath?.value?.valid) ?? false;
  });
}
