import { App, nextTick, onUnmounted, unref, watch } from 'vue';
import { setupDevtoolsPlugin, DevtoolsPluginApi, CustomInspectorNode, CustomInspectorState } from '@vue/devtools-api';
import { PrivateFieldContext, PrivateFormContext } from './types';
import { normalizeField, throttle } from './utils';

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

function setupApiHooks(api: DevtoolsPluginApi) {
  API = api;

  api.addInspector({
    id: INSPECTOR_ID,
    icon: 'check',
    label: 'vee-validate',
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
    }

    if (field && type === 'field') {
      payload.state = buildFieldState(field);
    }
  });
}

function mapFormForDevtoolsInspector(form: PrivateFormContext): CustomInspectorNode {
  const { textColor, bgColor } = getTagTheme(form);

  return {
    id: encodeNodeId(form),
    label: 'Form',
    children: Object.values(form.fieldsByPath.value)
      .flat(2)
      .map(field => ({ ...mapFieldForDevtoolsInspector(field), id: encodeNodeId(form, field) })),
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

function mapFieldForDevtoolsInspector(field: PrivateFieldContext): Omit<CustomInspectorNode, 'id'> {
  const { textColor, bgColor } = getTagTheme(field);

  return {
    label: unref(field.name),
    tags: [
      {
        label: 'Field',
        textColor,
        backgroundColor: bgColor,
      },
    ],
  };
}

function encodeNodeId(form: PrivateFormContext, field?: PrivateFieldContext): string {
  const idObject = { f: form.formId, ff: unref(field?.name), type: field ? 'field' : 'form' };

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

    return {
      type: idObject.type,
      form,
      field: normalizeField(form.fieldsByPath.value[idObject.ff]),
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
        key: 'errors',
        value: errorBag.value,
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
