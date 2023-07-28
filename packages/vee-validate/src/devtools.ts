import { ComponentInternalInstance, getCurrentInstance, nextTick, onUnmounted, unref } from 'vue';
import {
  App,
  setupDevtoolsPlugin,
  DevtoolsPluginApi,
  CustomInspectorNode,
  CustomInspectorState,
  InspectorNodeTag,
} from '@vue/devtools-api';
import { PathState, PrivateFieldContext, PrivateFormContext } from './types';
import { keysOf, setInPath, throttle } from './utils';
import { isObject } from '../../shared';

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
      setupApiHooks,
    );
  }
}

const DEVTOOLS_FORMS: Record<string, PrivateFormContext & { _vm?: ComponentInternalInstance | null }> = {};
const DEVTOOLS_FIELDS: Record<string, PrivateFieldContext & { _vm?: ComponentInternalInstance | null }> = {};

let API: DevtoolsPluginApi<Record<string, any>> | undefined;

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

    installDevtoolsPlugin(app as unknown as App);
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

    installDevtoolsPlugin(app as unknown as App);
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

let SELECTED_NODE:
  | { type: 'pathState'; form: PrivateFormContext; state: PathState }
  | { type: 'form'; form: PrivateFormContext & { _vm?: ComponentInternalInstance | null } }
  | { type: 'field'; field: PrivateFieldContext & { _vm?: ComponentInternalInstance | null } }
  | null = null;

function setupApiHooks(api: DevtoolsPluginApi<Record<string, any>>) {
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

          if (SELECTED_NODE.type === 'field') {
            await SELECTED_NODE.field.validate();
            return;
          }

          if (SELECTED_NODE.type === 'form') {
            await SELECTED_NODE.form.validate();
            return;
          }

          if (SELECTED_NODE.type === 'pathState') {
            await SELECTED_NODE.form.validateField(SELECTED_NODE.state.path);
          }
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

          if (SELECTED_NODE.type === 'field') {
            SELECTED_NODE.field.resetField();
            return;
          }

          if (SELECTED_NODE.type === 'form') {
            SELECTED_NODE.form.resetForm();
          }

          if (SELECTED_NODE.type === 'pathState') {
            SELECTED_NODE.form.resetField(SELECTED_NODE.state.path);
          }
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

    const { form, field, state, type } = decodeNodeId(payload.nodeId);

    if (form && type === 'form') {
      payload.state = buildFormState(form);
      SELECTED_NODE = { type: 'form', form };
      highlightSelected();
      return;
    }

    if (state && type === 'pathState' && form) {
      payload.state = buildFieldState(state);
      SELECTED_NODE = { type: 'pathState', state, form };
      highlightSelected();
      return;
    }

    if (field && type === 'field') {
      payload.state = buildFieldState({
        errors: field.errors.value,
        dirty: field.meta.dirty,
        valid: field.meta.valid,
        touched: field.meta.touched,
        value: field.value.value,
        initialValue: field.meta.initialValue,
      });
      SELECTED_NODE = { field, type: 'field' };
      highlightSelected();
      return;
    }

    SELECTED_NODE = null;
  });
}

function mapFormForDevtoolsInspector(form: PrivateFormContext): CustomInspectorNode {
  const { textColor, bgColor } = getValidityColors(form.meta.value.valid);

  const formTreeNodes = {};
  Object.values(form.getAllPathStates()).forEach(state => {
    setInPath(formTreeNodes, unref(state.path), mapPathForDevtoolsInspector(state, form));
  });

  function buildFormTree(tree: any[] | Record<string, any>, path: string[] = []): CustomInspectorNode {
    const key = [...path].pop();
    if ('id' in tree) {
      return {
        ...tree,
        label: key || tree.label,
      } as CustomInspectorNode;
    }

    if (isObject(tree)) {
      return {
        id: `${path.join('.')}`,
        label: key || '',
        children: Object.keys(tree).map(key => buildFormTree(tree[key] as any, [...path, key])),
      };
    }

    if (Array.isArray(tree)) {
      return {
        id: `${path.join('.')}`,
        label: `${key}[]`,
        children: tree.map((c, idx) => buildFormTree(c, [...path, String(idx)])),
      };
    }

    return { id: '', label: '', children: [] };
  }

  const { children } = buildFormTree(formTreeNodes);

  return {
    id: encodeNodeId(form),
    label: 'Form',
    children,
    tags: [
      {
        label: 'Form',
        textColor,
        backgroundColor: bgColor,
      },
      {
        label: `${form.getAllPathStates().length} fields`,
        textColor: COLORS.white,
        backgroundColor: COLORS.unknown,
      },
    ],
  };
}

function mapPathForDevtoolsInspector(state: PathState, form?: PrivateFormContext): CustomInspectorNode {
  return {
    id: encodeNodeId(form, state),
    label: unref(state.path),
    tags: getFieldNodeTags(state.multiple, state.fieldsCount, state.type, state.valid, form),
  };
}

function mapFieldForDevtoolsInspector(field: PrivateFieldContext, form?: PrivateFormContext): CustomInspectorNode {
  return {
    id: encodeNodeId(form, field),
    label: unref(field.name),
    tags: getFieldNodeTags(false, 1, field.type, field.meta.valid, form),
  };
}

function getFieldNodeTags(
  multiple: boolean,
  fieldsCount: number,
  type: string | undefined,
  valid: boolean,
  form: PrivateFormContext | undefined,
) {
  const { textColor, bgColor } = getValidityColors(valid);

  return [
    multiple
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
    type === 'checkbox'
      ? {
          label: 'Checkbox',
          textColor: COLORS.white,
          backgroundColor: COLORS.blue,
        }
      : undefined,
    type === 'radio'
      ? {
          label: 'Radio',
          textColor: COLORS.white,
          backgroundColor: COLORS.purple,
        }
      : undefined,
    multiple
      ? {
          label: 'Multiple',
          textColor: COLORS.black,
          backgroundColor: COLORS.orange,
        }
      : undefined,
  ].filter(Boolean) as InspectorNodeTag[];
}

function encodeNodeId(form?: PrivateFormContext, stateOrField?: PathState | PrivateFieldContext): string {
  const type = stateOrField ? ('path' in stateOrField ? 'pathState' : 'field') : 'form';
  const fieldPath = stateOrField ? ('path' in stateOrField ? stateOrField?.path : unref(stateOrField?.name)) : '';
  const idObject = { f: form?.formId, ff: fieldPath, type };

  return btoa(encodeURIComponent(JSON.stringify(idObject)));
}

function decodeNodeId(nodeId: string): {
  field?: PrivateFieldContext & { _vm?: ComponentInternalInstance | null };
  form?: PrivateFormContext & { _vm?: ComponentInternalInstance | null };
  state?: PathState;
  type?: 'form' | 'field' | 'pathState';
} {
  try {
    const idObject = JSON.parse(decodeURIComponent(atob(nodeId)));
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

    const state = form.getPathState(idObject.ff);

    return {
      type: idObject.type,
      form,
      state,
    };
  } catch (err) {
    // console.error(`Devtools: [vee-validate] Failed to parse node id ${nodeId}`);
  }

  return {};
}

function buildFieldState(
  state: Pick<PathState, 'errors' | 'initialValue' | 'touched' | 'dirty' | 'value' | 'valid'>,
): CustomInspectorState {
  return {
    'Field state': [
      { key: 'errors', value: state.errors },
      {
        key: 'initialValue',
        value: state.initialValue,
      },
      {
        key: 'currentValue',
        value: state.value,
      },
      {
        key: 'touched',
        value: state.touched,
      },
      {
        key: 'dirty',
        value: state.dirty,
      },
      {
        key: 'valid',
        value: state.valid,
      },
    ],
  };
}

function buildFormState(form: PrivateFormContext): CustomInspectorState {
  const { errorBag, meta, values, isSubmitting, isValidating, submitCount } = form;

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
        key: 'isValidating',
        value: isValidating.value,
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
        value: keysOf(errorBag.value).reduce(
          (acc, key) => {
            const message = errorBag.value[key]?.[0];
            if (message) {
              acc[key] = message;
            }

            return acc;
          },
          {} as Record<string, string | undefined>,
        ),
      },
    ],
  };
}

/**
 * Resolves the tag color based on the form state
 */
function getValidityColors(valid: boolean) {
  return {
    bgColor: valid ? COLORS.success : COLORS.error,
    textColor: valid ? COLORS.black : COLORS.white,
  };
}
