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
    const { push, remove, swap, insert, replace, update, prepend, move, fields } = useFieldArray(toRef(props, 'name'));

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
        move,
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
      move,
    });

    return () => {
      const children = normalizeChildren(undefined, ctx, slotProps);

      return children;
    };
  },
});

export const FieldArray = FieldArrayImpl as typeof FieldArrayImpl & {
  new (): {
    push: FieldArrayContext['push'];
    remove: FieldArrayContext['remove'];
    swap: FieldArrayContext['swap'];
    insert: FieldArrayContext['insert'];
    update: FieldArrayContext['update'];
    replace: FieldArrayContext['replace'];
    prepend: FieldArrayContext['prepend'];
    move: FieldArrayContext['move'];
    $slots: {
      default: (arg: UnwrapRef<FieldArrayContext>) => VNode[];
    };
  };
};
