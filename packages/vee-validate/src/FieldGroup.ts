import { defineComponent, UnwrapRef, VNode } from 'vue';
import { FieldGroupContext, FieldGroupMeta } from './types';
import { normalizeChildren } from './utils';
import { useFieldGroup } from './useFieldGroup';

const FieldGroupImpl = /** #__PURE__ */ defineComponent({
  name: 'FieldGroup',
  inheritAttrs: false,
  props: {
    checkChildFieldGroups: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, ctx: any) {
    const { meta } = useFieldGroup(() => props.withChildFieldGroups);

    ctx.expose({
      meta,
    });

    function slotProps() {
      return {
        meta: meta.value,
      };
    }

    return () => {
      const children = normalizeChildren(undefined, ctx, slotProps);

      return children;
    };
  },
});

export const FieldGroup = FieldGroupImpl as typeof FieldGroupImpl & {
  new (): {
    meta: FieldGroupMeta;
    $slots: {
      default: (arg: UnwrapRef<FieldGroupContext>) => VNode[];
    };
  };
};
