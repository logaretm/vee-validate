import { defineComponent, toRef } from 'vue';
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
  },
  setup(props, ctx) {
    const { push, remove, entries } = useFieldArray(toRef(props, 'name'));

    function slotProps() {
      return {
        entries: entries.value,
        push,
        remove,
      };
    }

    ctx.expose({
      push,
      remove,
    });

    return () => {
      const children = normalizeChildren(undefined, ctx, slotProps);

      return children;
    };
  },
});
