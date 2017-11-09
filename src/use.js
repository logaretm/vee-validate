import Validator from './core/validator';
import ErrorBag from './core/errorBag';
import { isFunction } from 'lodash';
import { warn } from './core/utils';

// @flow

function use (plugin: (ctx: PluginContext, options?: any) => any, options?: any = {}) {
  if (!isFunction(plugin)) {
    return warn('The plugin must be a callable function');
  }

  plugin({ Validator, ErrorBag, Rules: Validator.rules }, options);
};

export default use;
