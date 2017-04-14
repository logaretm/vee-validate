import { addClass, removeClass, assign } from './utils';

const DEFAULT_CLASS_NAMES = {
  touched: 'touched', // the control has been blurred
  untouched: 'untouched', // the control hasn't been blurred
  valid: 'valid', // model is valid
  invalid: 'invalid', // model is invalid
  pristine: 'pristine', // control has not been interacted with
  dirty: 'dirty' // control has been interacted with
};

export default class ClassListener
{
  constructor(el, fieldName, validator, options = {}) {
    this.el = el;
    this.fieldName = fieldName;
    this.validator = validator;
    this.classNames = assign({}, DEFAULT_CLASS_NAMES, options.classNames || {});
    this.listeners = {};
  }

  attach() {
    this.add(this.classNames.pristine);
    this.add(this.classNames.untouched);
    this.listeners.focus = () => {
      this.remove(this.classNames.untouched);
      this.add(this.classNames.touched);
      this.el.removeEventListener('focus', this.listeners.focus);
    };
    this.listeners.input = () => {
      this.remove(this.classNames.pristine);
      this.add(this.classNames.dirty);
      this.el.removeEventListener('input', this.listeners.input);
    };
    this.listeners.after = (e) => {
      this.remove(e.valid ? this.classNames.invalid : this.classNames.valid);
      this.add(e.valid ? this.classNames.valid : this.classNames.invalid);
    };

    this.el.addEventListener('focus', this.listeners.focus);
    this.el.addEventListener('input', this.listeners.input);
    this.validator.on('after', this.fieldName, this.listeners.after);
  }

  detach() {
    this.el.removeEventListener('focus', this.listeners.focus);
    this.el.removeEventListener('input', this.listeners.input);
    this.validator.off('after', this.fieldName);
  }

  add(className) {
    addClass(this.el, className);
  }

  remove(className) {
    removeClass(this.el, className);
  }
}
