import Config from '../../src/config';
import Dictionary from '../../src/core/localization/i18n';

test('it stores the default config', () => {
  expect(Config.default).toEqual({
    locale: 'en',
    delay: 0,
    errorBagName: 'errors',
    dictionary: null,
    strict: true,
    fieldsBagName: 'fields',
    classes: false,
    classNames: null,
    events: 'input|blur',
    inject: true,
    fastExit: true,
    aria: true,
    validity: false,
    i18n: null,
    i18nRootKey: 'validation'
  });
});

test('it merges new config with the current one', () => {
  expect(Config.current.aria).toBe(true);
  Config.merge({ aria: false });
  expect(Config.current.aria).toBe(false);
});

describe('resolves the working config from a vue instance', () => {
  test('when no config is set', () => {
    const conf = Config.resolve({
      $options: {}
    });

    expect(conf.validity).toBe(false);
  });

  test('when config is set', () => {
    const conf = Config.resolve({
      $options: {
        $_veeValidate: {
          validity: true
        }
      }
    });
  
    expect(conf.validity).toBe(true);
  });
  
})

test('can fetch/register dependencies', () => {
  expect(Config.dependency('key')).toBe(undefined);
  const myDep = {};
  Config.register('key', myDep);
  expect(Config.dependency('key')).toBe(myDep);
});

test('initializes i18n dictionary', () => {
  expect(Config.dependency('dictionary') instanceof Dictionary).toBe(false);
  Config.merge({
    i18n: { locale: 'en' }
  });

  expect(Config.dependency('dictionary') instanceof Dictionary).toBe(true);
});
