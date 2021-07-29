import { App, Ref } from 'vue';
import { setupDevtoolsPlugin, DevtoolsPluginApi, InspectedComponentData } from '@vue/devtools-api';
import { DevtoolsPluginFieldState, DevtoolsPluginFormState, PrivateFieldContext, PrivateFormContext } from './types';

type VeeValidateComponentInstance = {
  _vvFields?: PrivateFieldContext[];
  _vvForms?: PrivateFormContext[];
};

const fieldStateType = 'Field Validation State';
const formStateType = 'Form Validation State';

const COLORS = {
  error: 0xbd4b4b,
  success: 0x06d77b,
  unknown: 0x54436b,
  white: 0xffffff,
  black: 0x000000,
};

export function setupDevtools(app: App) {
  if (process.env.NODE_ENV === 'development') {
    setupDevtoolsPlugin(
      {
        id: 'vee-validate-devtools-plugin',
        label: 'VeeValidate Plugin',
        packageName: 'vee-validate',
        homepage: 'https://vee-validate.logaretm.com/v4',
        app,
        componentStateTypes: [fieldStateType, formStateType],
      },
      setupApiHooks
    );
  }
}

function setupApiHooks(api: DevtoolsPluginApi) {
  api.on.visitComponentTree((payload, context) => {
    if (shouldSkipNode(payload)) {
      return;
    }

    const node = payload.treeNode;
    if (payload.componentInstance._vvFields) {
      const isMany = payload.componentInstance._vvFields.length > 1;
      const { bgColor, textColor } = getTagTheme(payload.componentInstance);
      node.tags.push({
        label: isMany ? `${payload.componentInstance._vvFields.length} fields` : `Field`,
        textColor,
        backgroundColor: bgColor,
      });
    }

    if (payload.componentInstance._vvForms) {
      const isMany = payload.componentInstance._vvForms.length > 1;
      const { bgColor, textColor } = getTagTheme(payload.componentInstance);

      node.tags.push({
        label: isMany ? `${payload.componentInstance._vvForms.length} forms` : `Form`,
        textColor,
        backgroundColor: bgColor,
      });
    }
  });

  api.on.inspectComponent((payload, context) => {
    if (shouldSkipNode(payload)) {
      return;
    }

    if (payload.componentInstance.type.name === 'Field') {
      // pushFieldState(api, payload);
      return;
    }

    if (payload.componentInstance.type.name === 'Form') {
      // pushFormState(api, payload);
    }
  });
}

/**
 * Determines if a component inspection should be skipped, it will be skipped if it is NOT using vee-validate
 */
function shouldSkipNode(payload: any) {
  if (payload.componentInstance._vvFields || payload.componentInstance._vvForms) {
    return false;
  }

  return true;
}

function pushFieldState(
  api: DevtoolsPluginApi,
  payload: { app: any; componentInstance: any; instanceData: InspectedComponentData }
) {
  const fieldPluginState: Ref<DevtoolsPluginFieldState> | undefined = payload.componentInstance._vvalidationState;
  if (!fieldPluginState || !fieldPluginState.value) {
    return;
  }

  const { errors, meta, value } = fieldPluginState.value;

  payload.instanceData.state.push({
    type: fieldStateType,
    key: 'errors',
    value: errors,
  });
  payload.instanceData.state.push({
    type: fieldStateType,
    key: 'initialValue',
    value: meta.initialValue,
  });
  payload.instanceData.state.push({
    type: fieldStateType,
    key: 'currentValue',
    value: value,
  });
  payload.instanceData.state.push({
    type: fieldStateType,
    key: 'touched',
    value: meta.touched,
  });
  payload.instanceData.state.push({
    type: fieldStateType,
    key: 'dirty',
    value: meta.dirty,
  });
  payload.instanceData.state.push({
    type: fieldStateType,
    key: 'valid',
    value: meta.valid,
  });
}

function pushFormState(
  api: DevtoolsPluginApi,
  payload: { app: any; componentInstance: any; instanceData: InspectedComponentData }
) {
  const formPluginState: Ref<DevtoolsPluginFormState> | undefined = payload.componentInstance._vvalidationState;
  if (!formPluginState || !formPluginState.value) {
    return;
  }

  const { errors, meta, values, isSubmitting, submitCount } = formPluginState.value;

  payload.instanceData.state.push({
    type: formStateType,
    key: 'errors',
    value: errors.value,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'initialValues',
    value: meta.initialValues,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'currentValues',
    value: values,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'touched',
    value: meta.touched,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'dirty',
    value: meta.dirty,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'valid',
    value: meta.valid,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'submitCount',
    value: submitCount,
  });
  payload.instanceData.state.push({
    type: formStateType,
    key: 'isSubmitting',
    value: isSubmitting,
  });
}

/**
 * Resolves the tag color based on the form state
 */
function getTagTheme(component: VeeValidateComponentInstance) {
  const fallbackColors = {
    bgColor: COLORS.unknown,
    textColor: COLORS.white,
  };

  if (component._vvForms) {
    const isValid = component._vvForms[0].meta.value.valid;

    return component._vvForms.length === 1
      ? {
          bgColor: isValid ? COLORS.success : COLORS.error,
          textColor: isValid ? COLORS.black : COLORS.white,
        }
      : fallbackColors;
  }

  if (component._vvFields) {
    const isValid = component._vvFields[0].meta.valid;

    return component._vvFields.length === 1
      ? {
          bgColor: isValid ? COLORS.success : COLORS.error,
          textColor: isValid ? COLORS.black : COLORS.white,
        }
      : fallbackColors;
  }

  return fallbackColors;
}
