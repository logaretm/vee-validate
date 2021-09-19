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
    const { push, remove, swap, insert, replace, update, prepend, fields } = useFieldArray(toRef(props, 'name'));

    function slotProps() {
      return {
        fields: fields.value,
        push,
        remove,
        swap,
        insert,
        update,
        replace,
        prepend,
      };
    }

    ctx.expose({
      push,
      remove,
      swap,
      insert,
      update,
      replace,
      prepend,
    });

    return () => {
      const children = normalizeChildren(undefined, ctx, slotProps);

      return children;
    };
  },
});
