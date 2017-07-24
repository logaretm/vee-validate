import Vue from 'vue';
import VeeValidate from '../src';

test('installs the plugin', () => {
  const plugin = Object.assign({}, VeeValidate);
  expect(plugin.installed).toBeFalsy();
  Vue.use(plugin);
  expect(plugin.installed).toBe(true);
});

test('installs the plugin and adds the dictionary at startup', () => {
  const plugin = Object.assign({}, VeeValidate);
  plugin.Validator.updateDictionary = jest.fn();
  expect(plugin.installed).toBeFalsy();
  Vue.use(plugin, {
    dictionary: {
      ar: {}
    }
  });
  expect(plugin.installed).toBe(true);
  expect(plugin.Validator.updateDictionary).toHaveBeenCalled();
});
