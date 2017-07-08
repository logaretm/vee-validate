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
   * @param {Object} matcher
   * @return {Array} Array of matching field items.
   */
  filter (matcher) {
    return this.items.filter(item => item.matches(matcher));
  }

  /**
   * Finds and removes the first field that matches the provided matcher object, returns the removed item.
   * @param {Object} matcher
   */
  remove (matcher) {
    const item = this.find(matcher);
    if (!item) return;

    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
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
