import { inject, h, defineComponent, computed, resolveDynamicComponent, VNode } from 'vue';
import { FormContextKey } from './symbols';
import { normalizeChildren } from './utils';

export interface ErrorMessageSlotProps {
  message: string | undefined;
}

const ErrorMessageImpl = /** #__PURE__ */ defineComponent({
  name: 'ErrorMessage',
  props: {
    as: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const form = inject(FormContextKey, undefined);
    const message = computed<string | undefined>(() => {
      return form?.errors.value[props.name];
    });

    function slotProps(): ErrorMessageSlotProps {
      return {
        message: message.value,
      };
    }

    return () => {
      // Renders nothing if there are no messages
      if (!message.value) {
        return undefined;
      }

      const tag = (props.as ? resolveDynamicComponent(props.as) : props.as) as string;
      const children = normalizeChildren(tag, ctx, slotProps as any);

      const attrs = {
        role: 'alert',
        ...ctx.attrs,
      };

      // If no tag was specified and there are children
      // render the slot as is without wrapping it
      if (!tag && (Array.isArray(children) || !children) && children?.length) {
        return children;
      }

      // If no children in slot
      // render whatever specified and fallback to a <span> with the message in it's contents
      if ((Array.isArray(children) || !children) && !children?.length) {
        return h(tag || 'span', attrs, message.value);
      }

      return h(tag, attrs, children);
    };
  },
});

export const ErrorMessage = ErrorMessageImpl as typeof ErrorMessageImpl & {
  new (): {
    $slots: {
      default: (arg: ErrorMessageSlotProps) => VNode[];
    };
  };
};
