import { find } from './utils';

export default class FieldBag {
  constructor() {
    this.items = [];
  }

  /**
   * Finds the first field that matches the provided matcher object.
   * @param {Object} matcher
   */
  find(matcher) {
    return find(this.items, item => item.matches(matcher));
  }

  /**
   * Finds and removes the first field that matches the provided matcher object.
   * @param {Object} matcher
   */
  remove(matcher) {
    const item = this.find(matcher);
    if (!item) return;

    const index = this.items.indexOf(item);
    if (index === -1) return;

    this.items.splice(index, 1);
  }
}

