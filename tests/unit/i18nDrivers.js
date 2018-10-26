import DictionaryResolver from '@/dictionary';
import DefaultDictionary from '@/localization/default';

test('uses the default i18n driver', () => {
  expect(DictionaryResolver.getDriver()).toBeInstanceOf(DefaultDictionary);
});

test('can set new drivers', () => {
  const driver = {};
  DictionaryResolver.setDriver('new', driver);
  expect(DictionaryResolver.getDriver()).toBe(driver);

  DictionaryResolver.setDriver('default');
  expect(DictionaryResolver.getDriver()).toBeInstanceOf(DefaultDictionary);
});

test('does not allow falsy values for driver name', () => {
  expect(() => {
    DictionaryResolver.setDriver('', {});
  }).toThrow();
});
