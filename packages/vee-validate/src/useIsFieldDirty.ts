import { computed, MaybeRef } from 'vue';
import { resolveFieldOrPathState } from './utils';

/**
 * If a field is dirty or not
 */
export function useIsFieldDirty(path?: MaybeRef<string>) {
  const fieldOrPath = resolveFieldOrPathState(path);

  return computed(() => {
    if (!fieldOrPath) {
      return false;
    }
    return ('meta' in fieldOrPath ? fieldOrPath.meta.dirty : fieldOrPath?.value?.dirty) ?? false;
  });
}
