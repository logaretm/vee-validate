import Field from './field';
import { find, createError } from './utils';

// @flow

export default class FieldBag {
  items: Array<Field>;

  constructor () {
    this.items = [];
  }

  /**
   * Gets the current items length.
   */

  get length (): number {
    return this.items.length;
  }

  /**
   * Finds the first field that matches the provided matcher object.
   */
  find (matcher: Object): ?Field {
    return find(this.items, item => item.matches(matcher));
  }

  /**
   * Filters the items down to the matched fields.
   */
  filter (matcher: Object | Array<any>): Array<Field> {
    // multiple matchers to be tried.
    if (Array.isArray(matcher)) {
      return this.items.filter(item => matcher.some(m => item.matches(m)));
    }

    return this.items.filter(item => item.matches(matcher));
  }

  /**
   * Maps the field items using the mapping function.
   */
  map (mapper: (f: Field) => any): Array<Field> {
    return this.items.map(mapper);
  }

  /**
   * Finds and removes the first field that matches the provided matcher object, returns the removed item.
   */
  remove (matcher: Object | Field): Field | null {
    let item = null;
    if (matcher instanceof Field) {
      item = matcher;
    } else {
      item = this.find(matcher);
    }

    if (!item) return null;

    const index = this.items.indexOf(item);
    this.items.splice(index, 1);

    return item;
  }

  /**
   * Adds a field item to the list.
   */
  push (item: ?Field) {
    if (! (item instanceof Field)) {
      throw createError('FieldBag only accepts instances of Field that has an id defined.');
    }

    if (!item.id) {
      throw createError('Field id must be defined.');
    }

    if (this.find({ id: item.id })) {
      throw createError(`Field with id ${item.id} is already added.`);
    }

    this.items.push(item);
  }
}
