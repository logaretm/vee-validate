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
    const { push, remove, arrayValues } = useFieldArray(toRef(props, 'name'));

    function slotProps() {
      return {
        arrayValues: arrayValues.value,
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
