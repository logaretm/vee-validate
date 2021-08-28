import { defineComponent, toRefs } from 'vue';
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
    const { push, remove, swap, insert, entries } = useFieldArray(toRefs(props));

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
