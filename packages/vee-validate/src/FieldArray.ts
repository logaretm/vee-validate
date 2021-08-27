import { defineComponent, toRef, toRefs } from 'vue';
import { useFieldArray } from './useFieldArray';
import { normalizeChildren } from './utils';

export const FieldArray = defineComponent({
  name: 'FieldArray',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true,
    },
    keyPath: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const { name, keyPath } = toRefs(props);
    const { push, remove, swap, insert, entries } = useFieldArray(name, keyPath);

    function slotProps() {
      return {
        entries: entries.value,
        push,
        remove,
        swap,
        insert,
      };
    }

    ctx.expose({
      push,
      remove,
      swap,
      insert,
    });

    return () => {
      const children = normalizeChildren(undefined, ctx, slotProps);

      return children;
    };
  },
});
