import Field from './field';
import { find, createError } from './utils';

export default class FieldBag {
  constructor () {
    this.items = [];
  }

  /**
   * @return {Number} The current collection length.
   */
  get length () {
    return this.items.length;
  }

  /**
   * Finds the first field that matches the provided matcher object.
   * @param {Object} matcher
   * @return {Field|undefined} The first matching item.
   */
  find (matcher) {
    return find(this.items, item => item.matches(matcher));
  }

  /**
   * @param {Object|Array} matcher
   * @return {Array} Array of matching field items.
   */
  filter (matcher) {
    // multiple matchers to be tried.
    if (Array.isArray(matcher)) {
      return this.items.filter(item => matcher.some(m => item.matches(m)));
    }

    return this.items.filter(item => item.matches(matcher));
  }

  /**
   * Maps the field items using the mapping function.
   *
   * @param {Function} mapper
   */
  map (mapper) {
    return this.items.map(mapper);
  }

  /**
   * Finds and removes the first field that matches the provided matcher object, returns the removed item.
   * @param {Object|Field} matcher
   * @return {Field|null}
   */
  remove (matcher) {
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
   *
   * @param {Field} item
   */
  push (item) {
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
