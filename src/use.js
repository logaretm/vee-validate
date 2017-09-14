import Validator from './validator';
import ErrorBag from './errorBag';
import { warn, isCallable } from './utils';

function use (plugin, options = {}) {
  if (!isCallable(plugin)) {
    return warn('The plugin must be a callable function');
  }

  plugin({ Validator, ErrorBag, Rules: Validator.rules }, options);
};

export default use;
