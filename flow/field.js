declare type Watcher = {
  tag: string,
  unwatch: () => any
};

declare type FieldMatchOptions = {
  id?: string,
  scope?: string,
  name?: string
}

declare type FieldError = {
  field: string,
  msg: string,
  scope: ?string,
  id: ?string,
  rule: ?string,
  regenerate?: () => string // regenerates the error message.
};
