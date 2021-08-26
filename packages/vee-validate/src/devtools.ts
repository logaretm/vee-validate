import { App, getCurrentInstance, nextTick, onUnmounted, unref } from 'vue';
import {
  setupDevtoolsPlugin,
  DevtoolsPluginApi,
  CustomInspectorNode,
  CustomInspectorState,
  InspectorNodeTag,
  ComponentInstance,
} from '@vue/devtools-api';
import { PrivateFieldContext, PrivateFormContext } from './types';
import { keysOf, normalizeField, throttle } from './utils';

function installDevtoolsPlugin(app: App) {
  if (__DEV__) {
    setupDevtoolsPlugin(
      {
        id: 'vee-validate-devtools-plugin',
        label: 'VeeValidate Plugin',
        packageName: 'vee-validate',
        homepage: 'https://vee-validate.logaretm.com/v4',
        app,
        logo: 'https://vee-validate.logaretm.com/v4/logo.png',
      },
      setupApiHooks
    );
  }
}

const DEVTOOLS_FORMS: Record<string, PrivateFormContext & { _vm?: ComponentInstance | null }> = {};
const DEVTOOLS_FIELDS: Record<string, PrivateFieldContext & { _vm?: ComponentInstance | null }> = {};

let API: DevtoolsPluginApi | undefined;

export const refreshInspector = throttle(() => {
  setTimeout(async () => {
    await nextTick();
    API?.sendInspectorState(INSPECTOR_ID);
    API?.sendInspectorTree(INSPECTOR_ID);
  }, 100);
}, 100);

export function registerFormWithDevTools(form: PrivateFormContext) {
  const vm = getCurrentInstance();
  if (!API) {
    const app = vm?.appContext.app;
    if (!app) {
      return;
    }

    installDevtoolsPlugin(app);
  }

  DEVTOOLS_FORMS[form.formId] = { ...form };
  DEVTOOLS_FORMS[form.formId]._vm = vm;
  onUnmounted(() => {
    delete DEVTOOLS_FORMS[form.formId];
    refreshInspector();
  });

  refreshInspector();
}

export function registerSingleFieldWithDevtools(field: PrivateFieldContext) {
  const vm = getCurrentInstance();
  if (!API) {
    const app = vm?.appContext.app;
    if (!app) {
      return;
    }

    installDevtoolsPlugin(app);
  }

  DEVTOOLS_FIELDS[field.id] = { ...field };
  DEVTOOLS_FIELDS[field.id]._vm = vm;
  onUnmounted(() => {
    delete DEVTOOLS_FIELDS[field.id];
    refreshInspector();
  });

  refreshInspector();
}

const INSPECTOR_ID = 'vee-validate-inspector';

const COLORS = {
  error: 0xbd4b4b,
  success: 0x06d77b,
  unknown: 0x54436b,
  white: 0xffffff,
  black: 0x000000,
  blue: 0x035397,
  purple: 0xb980f0,
  orange: 0xf5a962,
  gray: 0xbbbfca,
};

let SELECTED_NODE: ((PrivateFormContext | PrivateFieldContext) & { _vm?: ComponentInstance | null }) | null = null;

function setupApiHooks(api: DevtoolsPluginApi) {
  API = api;
  // let highlightTimeout: number | null = null;
  function highlightSelected() {
    // const vm = SELECTED_NODE?._vm;
    // if (!vm) {
    //   return;
    // }
    // if (highlightTimeout) {
    //   window.clearTimeout(highlightTimeout);
    // }
    // api.unhighlightElement();
    // api.highlightElement(vm);
    // highlightTimeout = window.setTimeout(() => {
    //   api.unhighlightElement();
    //   highlightTimeout = null;
    // }, 3000);
  }

  api.addInspector({
    id: INSPECTOR_ID,
    icon: 'rule',
    label: 'vee-validate',
    noSelectionText: 'Select a vee-validate node to inspect',
    actions: [
      {
        icon: 'done_outline',
        tooltip: 'Validate selected item',
        action: async () => {
          if (!SELECTED_NODE) {
            console.error('There is not a valid selected vee-validate node or component');
            return;
          }

          const result = await SELECTED_NODE.validate();
          console.log(result);
        },
      },
      {
        icon: 'delete_sweep',
        tooltip: 'Clear validation state of the selected item',
        action: () => {
          if (!SELECTED_NODE) {
            console.error('There is not a valid selected vee-validate node or component');
            return;
          }

          if ('id' in SELECTED_NODE) {
            SELECTED_NODE.resetField();
            return;
          }

          SELECTED_NODE.resetForm();
        },
      },
    ],
  });

  api.on.getInspectorTree(payload => {
    if (payload.inspectorId !== INSPECTOR_ID) {
      return;
    }

    const forms = Object.values(DEVTOOLS_FORMS);
    const fields = Object.values(DEVTOOLS_FIELDS);

    payload.rootNodes = [
      ...forms.map(mapFormForDevtoolsInspector),
      ...fields.map(field => mapFieldForDevtoolsInspector(field)),
    ];
  });

  api.on.getInspectorState((payload, ctx) => {
    if (payload.inspectorId !== INSPECTOR_ID || ctx.currentTab !== `custom-inspector:${INSPECTOR_ID}`) {
      return;
    }

    const { form, field, type } = decodeNodeId(payload.nodeId);

    if (form && type === 'form') {
      payload.state = buildFormState(form);
      SELECTED_NODE = form;
      highlightSelected();
      return;
    }

    if (field && type === 'field') {
      payload.state = buildFieldState(field);
      SELECTED_NODE = field;
      highlightSelected();
      return;
    }

    SELECTED_NODE = null;
  });
}

function mapFormForDevtoolsInspector(form: PrivateFormContext): CustomInspectorNode {
  const { textColor, bgColor } = getTagTheme(form);

  return {
    id: encodeNodeId(form),
    label: 'Form',
    children: Object.values(form.fieldsByPath.value).map(field => {
      return { ...mapFieldForDevtoolsInspector(field as PrivateFieldContext, form) };
    }),
    tags: [
      {
        label: 'Form',
        textColor,
        backgroundColor: bgColor,
      },
      {
        label: `${Object.keys(form.fieldsByPath.value).length} fields`,
        textColor: COLORS.white,
        backgroundColor: COLORS.unknown,
      },
    ],
  };
}

function mapFieldForDevtoolsInspector(
  field: PrivateFieldContext | PrivateFieldContext[],
  form?: PrivateFormContext
): CustomInspectorNode {
  const fieldInstance = normalizeField(field) as PrivateFieldContext;
  const { textColor, bgColor } = getTagTheme(fieldInstance);
  const isGroup = Array.isArray(field) && field.length > 1;

  return {
    id: encodeNodeId(form, fieldInstance, !isGroup),
    label: unref(fieldInstance.name),
    children: Array.isArray(field) ? field.map(fieldItem => mapFieldForDevtoolsInspector(fieldItem, form)) : undefined,
    tags: [
      isGroup
        ? undefined
        : {
            label: 'Field',
            textColor,
            backgroundColor: bgColor,
          },
      !form
        ? {
            label: 'Standalone',
            textColor: COLORS.black,
            backgroundColor: COLORS.gray,
          }
        : undefined,
      !isGroup && fieldInstance.type === 'checkbox'
        ? {
            label: 'Checkbox',
            textColor: COLORS.white,
            backgroundColor: COLORS.blue,
          }
        : undefined,
      !isGroup && fieldInstance.type === 'radio'
        ? {
            label: 'Radio',
            textColor: COLORS.white,
            backgroundColor: COLORS.purple,
          }
        : undefined,
      isGroup
        ? {
            label: 'Group',
            textColor: COLORS.black,
            backgroundColor: COLORS.orange,
          }
        : undefined,
    ].filter(Boolean) as InspectorNodeTag[],
  };
}

function encodeNodeId(form?: PrivateFormContext, field?: PrivateFieldContext, encodeIndex = true): string {
  const fieldPath = form ? unref(field?.name) : field?.id;
  const fieldGroup = fieldPath ? form?.fieldsByPath.value[fieldPath] : undefined;
  let idx: number | undefined;
  if (encodeIndex && field && Array.isArray(fieldGroup)) {
    idx = fieldGroup.indexOf(field);
  }

  const idObject = { f: form?.formId, ff: fieldPath, idx, type: field ? 'field' : 'form' };

  return btoa(JSON.stringify(idObject));
}

function decodeNodeId(nodeId: string): {
  field?: PrivateFieldContext & { _vm?: ComponentInstance | null };
  form?: PrivateFormContext & { _vm?: ComponentInstance | null };
  type?: 'form' | 'field';
} {
  try {
    const idObject = JSON.parse(atob(nodeId));
    const form = DEVTOOLS_FORMS[idObject.f];

    if (!form && idObject.ff) {
      const field = DEVTOOLS_FIELDS[idObject.ff];
      if (!field) {
        return {};
      }

      return {
        type: idObject.type,
        field,
      };
    }

    if (!form) {
      return {};
    }

    const fieldGroup = form.fieldsByPath.value[idObject.ff];

    return {
      type: idObject.type,
      form,
      field: Array.isArray(fieldGroup) ? fieldGroup[idObject.idx || 0] : fieldGroup,
    };
  } catch (err) {
    // console.error(`Devtools: [vee-validate] Failed to parse node id ${nodeId}`);
  }

  return {};
}

function buildFieldState(field: PrivateFieldContext): CustomInspectorState {
  const { errors, meta, value } = field;

  return {
    'Field state': [
      { key: 'errors', value: errors.value },
      {
        key: 'initialValue',
        value: meta.initialValue,
      },
      {
        key: 'currentValue',
        value: value.value,
      },
      {
        key: 'touched',
        value: meta.touched,
      },
      {
        key: 'dirty',
        value: meta.dirty,
      },
      {
        key: 'valid',
        value: meta.valid,
      },
    ],
  };
}

function buildFormState(form: PrivateFormContext): CustomInspectorState {
  const { errorBag, meta, values, isSubmitting, submitCount } = form;

  return {
    'Form state': [
      {
        key: 'submitCount',
        value: submitCount.value,
      },
      {
        key: 'isSubmitting',
        value: isSubmitting.value,
      },
      {
        key: 'touched',
        value: meta.value.touched,
      },
      {
        key: 'dirty',
        value: meta.value.dirty,
      },
      {
        key: 'valid',
        value: meta.value.valid,
      },
      {
        key: 'initialValues',
        value: meta.value.initialValues,
      },
      {
        key: 'currentValues',
        value: values,
      },
      {
        key: 'errors',
        value: keysOf(errorBag.value).reduce((acc, key) => {
          const message = errorBag.value[key]?.[0];
          if (message) {
            acc[key] = message;
          }

          return acc;
        }, {} as Record<string, string | undefined>),
      },
    ],
  };
}

/**
 * Resolves the tag color based on the form state
 */
function getTagTheme(fieldOrForm: PrivateFormContext | PrivateFieldContext) {
  // const fallbackColors = {
  //   bgColor: COLORS.unknown,
  //   textColor: COLORS.white,
  // };

  const isValid = 'id' in fieldOrForm ? fieldOrForm.meta.valid : fieldOrForm.meta.value.valid;

  return {
    bgColor: isValid ? COLORS.success : COLORS.error,
    textColor: isValid ? COLORS.black : COLORS.white,
  };
}
