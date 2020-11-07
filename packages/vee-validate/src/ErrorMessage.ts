import { inject, h, defineComponent, computed, resolveDynamicComponent } from 'vue';
import { FormErrorsSymbol } from './symbols';
import { normalizeChildren } from './utils';

export const ErrorMessage = defineComponent({
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
    const errors = inject(FormErrorsSymbol, undefined);
    const message = computed<string | undefined>(() => {
      return errors?.value[props.name];
    });

    return () => {
      const children = normalizeChildren(ctx, {
        message: message.value,
      });

      const tag = (props.as ? resolveDynamicComponent(props.as) : props.as) as string;
      const attrs = {
        role: 'alert',
        ...ctx.attrs,
      };

      // If no tag was specified and there are children
      // render the slot as is without wrapping it
      if (!tag && children?.length) {
        return children;
      }

      // If no children in slot
      // render whatever specified and fallback to a <span> with the message in it's contents
      if (!children?.length) {
        return h(tag || 'span', attrs, message.value);
      }

      return h(tag, attrs, children);
    };
  },
});
