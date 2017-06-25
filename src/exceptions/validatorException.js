export default class ValidatorException extends Error {
  constructor(...args) {
    super(...args);
    this.message = `[vee-validate]: ${this.message}`;
  }
}
