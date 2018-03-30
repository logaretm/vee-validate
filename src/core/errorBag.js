import { find, isNullOrUndefined, isCallable } from './utils';

// @flow

export default class ErrorBag {
  items: FieldError[];

  constructor () {
    this.items = [];
  }

  [typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] () {
    let index = 0;
    return {
      next: () => {
        return { value: this.items[index++], done: index > this.items.length };
      }
    };
  }

  /**
   * Adds an error to the internal array.
   */
  add (error: FieldError | FieldError[]) {
    // handle old signature.
    if (arguments.length > 1) {
      error = {
        field: arguments[0],
        msg: arguments[1],
        rule: arguments[2],
        scope: !isNullOrUndefined(arguments[3]) ? arguments[3] : null,
        regenerate: null
      };
    }

    this.items.push(
      ...this._normalizeError(error)
    );
  }

  /**
   * Normalizes passed errors to an error array.
   */
  _normalizeError (error: FieldError | FieldError[]): FieldError[] {
    if (Array.isArray(error)) {
      return error.map(e => {
        e.scope = !isNullOrUndefined(e.scope) ? e.scope : null;

        return e;
      });
    }

    error.scope = !isNullOrUndefined(error.scope) ? error.scope : null;

    return [error];
  }

  /**
   * Regenrates error messages if they have a generator function.
   */
  regenerate (): void {
    this.items.forEach(i => {
      i.msg = isCallable(i.regenerate) ? i.regenerate() : i.msg;
    });
  }

  /**
   * Updates a field error with the new field scope.
   */
  update (id: string, error: FieldError) {
    const item = find(this.items, i => i.id === id);
    if (!item) {
      return;
    }

    const idx = this.items.indexOf(item);
    this.items.splice(idx, 1);
    item.scope = error.scope;
    this.items.push(item);
  }

  /**
   * Gets all error messages from the internal array.
   */
  all (scope: string): Array<string> {
    if (isNullOrUndefined(scope)) {
      return this.items.map(e => e.msg);
    }

    return this.items.filter(e => e.scope === scope).map(e => e.msg);
  }

  /**
   * Checks if there are any errors in the internal array.
   */
  any (scope: ?string): boolean {
    if (isNullOrUndefined(scope)) {
      return !!this.items.length;
    }

    return !!this.items.filter(e => e.scope === scope).length;
  }

  /**
   * Removes all items from the internal array.
   */
  clear (scope?: ?string) {
    if (isNullOrUndefined(scope)) {
      scope = null;
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].scope === scope) {
        this.items.splice(i, 1);
        --i;
      }
    }
  }

  /**
   * Collects errors into groups or for a specific field.
   */
  collect (field?: string, scope?: string | null, map?: boolean = true) {
    if (!field) {
      const collection = {};
      this.items.forEach(e => {
        if (! collection[e.field]) {
          collection[e.field] = [];
        }

        collection[e.field].push(map ? e.msg : e);
      });

      return collection;
    }

    field = !isNullOrUndefined(field) ? String(field) : field;
    if (isNullOrUndefined(scope)) {
      return this.items.filter(e => e.field === field).map(e => (map ? e.msg : e));
    }

    return this.items.filter(e => e.field === field && e.scope === scope)
      .map(e => (map ? e.msg : e));
  }
  /**
   * Gets the internal array length.
   */
  count (): number {
    return this.items.length;
  }

  /**
   * Finds and fetches the first error message for the specified field id.
   */
  firstById (id: string): string | null {
    const error = find(this.items, i => i.id === id);

    return error ? error.msg : null;
  }

  /**
   * Gets the first error message for a specific field.
   */
  first (field: string, scope ?: ?string = null) {
    if (isNullOrUndefined(field)) {
      return null;
    }

    field = String(field);
    const selector = this._selector(field);
    const scoped = this._scope(field);

    if (scoped) {
      const result = this.first(scoped.name, scoped.scope);
      // if such result exist, return it. otherwise it could be a field.
      // with dot in its name.
      if (result) {
        return result;
      }
    }

    if (selector) {
      return this.firstByRule(selector.name, selector.rule, scope);
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].field === field && (this.items[i].scope === scope)) {
        return this.items[i].msg;
      }
    }

    return null;
  }

  /**
   * Returns the first error rule for the specified field
   */
  firstRule (field: string, scope ?: string): string | null {
    const errors = this.collect(field, scope, false);

    return (errors.length && errors[0].rule) || null;
  }

  /**
   * Checks if the internal array has at least one error for the specified field.
   */
  has (field: string, scope?: ?string = null): boolean {
    return !!this.first(field, scope);
  }

  /**
   * Gets the first error message for a specific field and a rule.
   */
  firstByRule (name: string, rule: string, scope?: string | null = null) {
    const error = this.collect(name, scope, false).filter(e => e.rule === rule)[0];

    return (error && error.msg) || null;
  }

  /**
   * Gets the first error message for a specific field that not match the rule.
   */
  firstNot (name: string, rule?: string = 'required', scope?: string | null = null) {
    const error = this.collect(name, scope, false).filter(e => e.rule !== rule)[0];

    return (error && error.msg) || null;
  }

  /**
   * Removes errors by matching against the id or ids.
   */
  removeById (id: string | string[]) {
    if (Array.isArray(id)) {
      // filter out the non-matching fields.
      this.items = this.items.filter(i => id.indexOf(i.id) === -1);
      return;
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].id === id) {
        this.items.splice(i, 1);
        --i;
      }
    }
  }

  /**
   * Removes all error messages associated with a specific field.
   */
  remove (field: string, scope: ?string, id?: string) {
    field = !isNullOrUndefined(field) ? String(field) : field;
    const removeCondition = (e: FieldError) => {
      if (e.id && id) {
        return e.id === id;
      }

      if (!isNullOrUndefined(scope)) {
        return e.field === field && e.scope === scope;
      }

      return e.field === field && e.scope === null;
    };

    for (let i = 0; i < this.items.length; ++i) {
      if (removeCondition(this.items[i])) {
        this.items.splice(i, 1);
        --i;
      }
    }
  }

  /**
   * Get the field attributes if there's a rule selector.
   */
  _selector (field: string): { name: string, rule: string } | null {
    if (field.indexOf(':') > -1) {
      const [name, rule] = field.split(':');

      return { name, rule };
    }

    return null;
  }

  /**
   * Get the field scope if specified using dot notation.
   */
  _scope (field: string): { name: string, scope: string } | null {
    if (field.indexOf('.') > -1) {
      const [scope, ...name] = field.split('.');

      return { name: name.join('.'), scope };
    }

    return null;
  }
}
