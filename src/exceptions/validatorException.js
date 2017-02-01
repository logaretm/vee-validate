export default class
{
  constructor(msg) {
    this.msg = `[vee-validate]: ${msg}`;
  }

  toString() {
    return this.msg;
  }
}
