import {
  computed,
  inject,
  markRaw,
  onBeforeUnmount,
  provide,
  ref,
  Ref,
  toValue,
  ComputedRef,
  MaybeRefOrGetter,
} from 'vue';
import {
  FieldContextForFieldGroup,
  FieldGroupContextForParent,
  FieldGroupMeta,
  PrivateFieldGroupContext,
} from './types';
import { FieldGroupContextKey } from './symbols';

interface FieldGroupComposable {
  meta: ComputedRef<FieldGroupMeta>;
  fields: Ref<FieldContextForFieldGroup[]>;
  groups: Ref<FieldGroupContextForParent[]>;
}

export const useFieldGroup = (checkChildFieldGroups: MaybeRefOrGetter<boolean>): FieldGroupComposable => {
  const fields: Ref<FieldContextForFieldGroup[]> = ref([]);
  const groups: Ref<FieldGroupContextForParent[]> = ref([]);
  const parentFieldGroup = inject(FieldGroupContextKey, null);
  const providerContext: PrivateFieldGroupContext = { fields, groups };
  provide(FieldGroupContextKey, providerContext);

  const meta = computed<FieldGroupMeta>(() => {
    const checkChildGroups = toValue(checkChildFieldGroups);
    const groupsMeta = {
      valid: checkChildGroups ? groups.value.every((f: FieldGroupContextForParent) => toValue(f.meta).valid) : true,
      dirty: checkChildGroups ? groups.value.some((f: FieldGroupContextForParent) => toValue(f.meta).dirty) : false,
      touched: checkChildGroups ? groups.value.some((f: FieldGroupContextForParent) => toValue(f.meta).touched) : false,
      validated: checkChildGroups
        ? groups.value.every((f: FieldGroupContextForParent) => toValue(f.meta).validated)
        : true,
      pending: checkChildGroups ? groups.value.some((f: FieldGroupContextForParent) => toValue(f.meta).pending) : false,
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
    const dataForParentFieldGroup: FieldGroupContextForParent = markRaw({
      fields,
      meta,
    });
    parentFieldGroup.groups.value = [...parentFieldGroup.groups.value, dataForParentFieldGroup];

    onBeforeUnmount(() => {
      parentFieldGroup.groups.value = parentFieldGroup.groups.value.filter(
        (_dataForParentFieldGroup: FieldGroupContextForParent) => _dataForParentFieldGroup !== dataForParentFieldGroup,
      );

      groups.value = [];
      fields.value = [];
    });
  }

  return { meta, fields, groups };
};
