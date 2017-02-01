import Validator from '../validator';

/**
 * Keeps track of $vm, $validator instances.
 * @type {Array}
 */
const instances = [];

/**
 * Finds a validator instance from the instances array.
 * @param  {[type]} $vm The Vue instance.
 * @return {object} pair the $vm,$validator pair.
 */
const find = ($vm) => {
  for (let i = 0; i < instances.length; i++) {
    if (instances[i].$vm === $vm) {
      return instances[i].$validator;
    }
  }

  return undefined;
};

/**
 * Registers a validator for a $vm instance.
 * @param  {*} $vm The Vue instance.
 * @return {Validator} $validator The validator instance.
 */
const register = ($vm) => {
  let instance = find($vm);
  if (! instance) {
    instance = Validator.create(undefined, $vm, { init: false });

    instances.push({
      $vm,
      $validator: instance
    });
  }

  return instance;
};

const unregister = ($vm) => {
  for (let i = 0; i < instances.length; i++) {
    if (instances[i].$vm === $vm) {
      instances.splice(i, 1);

      return true;
    }
  }

  return false;
};

export { register, unregister, find };
