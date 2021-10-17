import { defineComponent, toRef, UnwrapRef, VNode } from 'vue';
import { FieldArrayContext } from './types';
import { useFieldArray } from './useFieldArray';
import { normalizeChildren } from './utils';

const FieldArrayImpl = defineComponent({
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

export const FieldArray = FieldArrayImpl as typeof FieldArrayImpl & {
  new (): {
    $slots: {
      default: (arg: UnwrapRef<FieldArrayContext>) => VNode[];
    };
  };
};
