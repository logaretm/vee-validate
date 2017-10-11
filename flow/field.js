declare type Watcher = {
  tag: string,
  unwatch: () => any
};

declare type FieldError = {
  field: string,
  msg: string,
  scope: ?string,
  id: ?string,
  rule: ?string
};