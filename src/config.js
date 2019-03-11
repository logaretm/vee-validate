import { assign, getPath } from './utils';

const DEFAULT_CONFIG = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  fieldsBagName: 'fields',
  classes: false,
  classNames: null,
  events: 'input',
  inject: true,
  fastExit: true,
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
