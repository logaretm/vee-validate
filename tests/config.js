import Config from '../src/config';

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
    validity: false
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