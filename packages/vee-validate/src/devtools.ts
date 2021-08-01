import { App, nextTick, onUnmounted, unref, watch } from 'vue';
import {
  setupDevtoolsPlugin,
  DevtoolsPluginApi,
  CustomInspectorNode,
  CustomInspectorState,
  InspectorNodeTag,
} from '@vue/devtools-api';
import { PrivateFieldContext, PrivateFormContext } from './types';
import { keysOf, normalizeField, throttle } from './utils';

const DEVTOOLS_FORMS: Record<string, PrivateFormContext> = {};

let API: DevtoolsPluginApi | undefined;

export function registerFormWithDevTools(form: PrivateFormContext) {
  DEVTOOLS_FORMS[form.formId] = form;
  onUnmounted(() => {
    delete DEVTOOLS_FORMS[form.formId];
  });

  API?.sendInspectorTree(INSPECTOR_ID);
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
        logo: 'https://vee-validate.logaretm.com/v4/logo.png',
      },
      setupApiHooks
    );
  }
}

export const refreshInspector = throttle(() => {
  setTimeout(async () => {
    await nextTick();
    API?.sendInspectorState(INSPECTOR_ID);
    API?.sendInspectorTree(INSPECTOR_ID);
  }, 100);
}, 100);

let SELECTED_NODE: PrivateFormContext | PrivateFieldContext | null = null;

function setupApiHooks(api: DevtoolsPluginApi) {
  API = api;

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

          if ('fid' in SELECTED_NODE) {
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

    payload.rootNodes = forms.map(mapFormForDevtoolsInspector);
  });

  api.on.getInspectorState(payload => {
    if (payload.inspectorId !== INSPECTOR_ID) {
      return;
    }

    const { form, field, type } = decodeNodeId(payload.nodeId);
    if (form && type === 'form') {
      payload.state = buildFormState(form);
      SELECTED_NODE = form;
      return;
    }

    if (field && type === 'field') {
      payload.state = buildFieldState(field);
      SELECTED_NODE = field;
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
    children: Object.values(form.fieldsByPath.value)
      .flat(2)
      .map(field => {
        return { ...mapFieldForDevtoolsInspector(form, field) };
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

function mapFieldForDevtoolsInspector(form: PrivateFormContext, field: PrivateFieldContext): CustomInspectorNode {
  const { textColor, bgColor } = getTagTheme(field);
  const pathValue = form.fieldsByPath.value[unref(field.name)];
  const isGroup = Array.isArray(pathValue) && pathValue.length > 1;

  return {
    id: encodeNodeId(form, field),
    label: unref(field.name),
    tags: [
      {
        label: 'Field',
        textColor,
        backgroundColor: bgColor,
      },
      field.type === 'checkbox'
        ? {
            label: 'Checkbox',
            textColor: COLORS.white,
            backgroundColor: COLORS.blue,
          }
        : undefined,
      field.type === 'radio'
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

function encodeNodeId(form: PrivateFormContext, field?: PrivateFieldContext): string {
  const fieldPath = unref(field?.name);
  const fieldGroup = fieldPath ? form.fieldsByPath.value[fieldPath] : undefined;
  let idx: number | undefined;
  if (field && Array.isArray(fieldGroup)) {
    idx = fieldGroup.indexOf(field);
  }

  const idObject = { f: form.formId, ff: fieldPath, idx, type: field ? 'field' : 'form' };

  return btoa(JSON.stringify(idObject));
}

function decodeNodeId(nodeId: string): {
  field?: PrivateFieldContext;
  form?: PrivateFormContext;
  type?: 'form' | 'field';
} {
  try {
    const idObject = JSON.parse(atob(nodeId));
    const form = DEVTOOLS_FORMS[idObject.f];

    if (!form) {
      return {};
    }

    const fieldGroup = form.fieldsByPath.value[idObject.ff];

    return {
      type: idObject.type,
      form,
      field: Array.isArray(fieldGroup) ? fieldGroup[idObject.idx] : fieldGroup,
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
    'Validation state': [
      {
        key: 'errors',
        value: keysOf(errorBag.value).reduce((acc, key) => {
          acc[key] = errorBag.value[key]?.[0];

          return acc;
        }, {} as Record<string, string | undefined>),
      },
      {
        key: 'valid',
        value: meta.value.valid,
      },
    ],
    'Form data': [
      {
        key: 'initialValues',
        value: meta.value.initialValues,
      },
      {
        key: 'currentValues',
        value: values,
      },
    ],
    'UX state': [
      {
        key: 'touched',
        value: meta.value.touched,
      },
      {
        key: 'dirty',
        value: meta.value.dirty,
      },
    ],
    'Submission state': [
      {
        key: 'submitCount',
        value: submitCount.value,
      },
      {
        key: 'isSubmitting',
        value: isSubmitting.value,
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

  const isValid = 'fid' in fieldOrForm ? fieldOrForm.meta.valid : fieldOrForm.meta.value.valid;

  return {
    bgColor: isValid ? COLORS.success : COLORS.error,
    textColor: isValid ? COLORS.black : COLORS.white,
  };
}
