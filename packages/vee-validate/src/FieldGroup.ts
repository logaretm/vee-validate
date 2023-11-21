import { computed, defineComponent, inject, provide, ref, toValue, onBeforeUnmount, UnwrapRef, VNode, Ref } from 'vue';
import {
  FieldContextForFieldGroup,
  FieldGroupContext,
  FieldGroupContextForParent,
  FieldGroupMeta,
  PrivateFieldGroupContext,
} from './types';
import { normalizeChildren } from './utils';
import { FieldGroupContextKey } from './symbols';

const FieldGroupImpl = /** #__PURE__ */ defineComponent({
  name: 'FieldGroup',
  inheritAttrs: false,
  setup(props: any, ctx: any) {
    const fields: Ref<FieldContextForFieldGroup[]> = ref([]);
    const groups: Ref<FieldGroupContextForParent[]> = ref([]);
    const parentFieldGroup = inject(FieldGroupContextKey, null);
    const providerContext: PrivateFieldGroupContext = { fields, groups };
    provide(FieldGroupContextKey, providerContext);

    const meta = computed(() => {
      const groupsMeta = {
        valid: groups.value.every((f: FieldGroupContextForParent) => toValue(f.meta).valid),
        dirty: groups.value.some((f: FieldGroupContextForParent) => toValue(f.meta).dirty),
        touched: groups.value.some((f: FieldGroupContextForParent) => toValue(f.meta).touched),
        validated: groups.value.every((f: FieldGroupContextForParent) => toValue(f.meta).validated),
        pending: groups.value.some((f: FieldGroupContextForParent) => toValue(f.meta).pending),
      };

      const fieldsMeta = {
        valid: fields.value.every((f: FieldContextForFieldGroup) => toValue(f.meta).valid),
        dirty: fields.value.some((f: FieldContextForFieldGroup) => toValue(f.meta).dirty),
        touched: fields.value.some((f: FieldContextForFieldGroup) => toValue(f.meta).touched),
        validated: fields.value.every((f: FieldContextForFieldGroup) => toValue(f.meta).validated),
        pending: fields.value.some((f: FieldContextForFieldGroup) => toValue(f.meta).pending),
      };

      return {
        valid: groupsMeta.valid && fieldsMeta.valid,
        dirty: groupsMeta.dirty || fieldsMeta.dirty,
        touched: groupsMeta.touched || fieldsMeta.touched,
        validated: groupsMeta.validated && fieldsMeta.validated,
        pending: groupsMeta.pending || fieldsMeta.pending,
      };
    });

    if (parentFieldGroup) {
      const dataForParentFieldGroup: FieldGroupContextForParent = {
        fields,
        meta,
      };
      parentFieldGroup.groups.value = [...parentFieldGroup.groups.value, dataForParentFieldGroup];

      onBeforeUnmount(() => {
        parentFieldGroup.groups.value = parentFieldGroup.groups.value.filter(
          (_dataForParentFieldGroup: FieldGroupContextForParent) =>
            _dataForParentFieldGroup !== dataForParentFieldGroup,
        );
      });
    }

    ctx.expose({
      meta,
    });

    function slotProps() {
      return {
        meta,
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
