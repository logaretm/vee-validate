import { computed, MaybeRefOrGetter } from 'vue';
import { resolveFieldOrPathState } from './utils';

/**
 * If a field is dirty or not
 */
export function useIsFieldDirty(path?: MaybeRefOrGetter<string>) {
  const fieldOrPath = resolveFieldOrPathState(path);

  return computed(() => {
    if (!fieldOrPath) {
      return false;
    }
    return ('meta' in fieldOrPath ? fieldOrPath.meta.dirty : fieldOrPath?.value?.dirty) ?? false;
  });
}
