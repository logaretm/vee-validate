declare type MapObject = { [string]: any };

declare type ValidatingVM = {
  $validator: Validator
};

declare type PluginContext = {
  Validator: Validator,
  ErrorBag: ErrorBag,
  Rules: Object
};
