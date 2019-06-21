import { VeeValidateConfig, setConfig } from './config';

export function install(_: any, config: VeeValidateConfig) {
  setConfig(config);
}
