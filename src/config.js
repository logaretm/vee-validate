import { assign, getPath } from './utils';

const DEFAULT_CONFIG = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  fieldsBagName: 'fields',
  classes: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input',
  inject: true,
  bails: true,
  aria: true,
  validity: false,
  mode: 'aggressive',
  useConstraintAttrs: true,
  i18n: null,
  i18nRootKey: 'validation'
};

export let currentConfig = assign({}, DEFAULT_CONFIG);

export const resolveConfig = (ctx) => {
  const selfConfig = getPath('$options.$_veeValidate', ctx, {});

  return assign({}, currentConfig, selfConfig);
};

export const getConfig = () => currentConfig;

export const setConfig = (newConf) => {
  currentConfig = assign({}, currentConfig, newConf);
};
