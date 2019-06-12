import { VeeValidateConfig, setConfig } from './config';
import * as Rules from './rules';
import en from '../locale/en';
import { extend } from './extend';
import { Dictionary, RootI18nDictionary } from './dictionary';

export function install(Vue: any, config: VeeValidateConfig) {
  setConfig(config);
}
