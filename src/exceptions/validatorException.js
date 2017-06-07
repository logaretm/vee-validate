export default class ValidatorException extends Error {
  constructor(...args) {
    super(...args);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidatorException);
    }

    this.message = `[vee-validate]: ${this.message}`;
  }
}
