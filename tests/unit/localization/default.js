import Dictionary from './../../../src/core/localization/default';

test('does not merge if a non object is provided', () => {
  const dict = new Dictionary('a string');

  expect(dict.hasLocale('en')).toBe(false);
});

test('can check for locale existance', () => {
  const dict = new Dictionary({
    en: { }
  });

  expect(dict.hasLocale('en')).toBe(true);
  expect(dict.hasLocale('ar')).toBe(false);
});

test('can check for message existance', () => {
  const dict = new Dictionary({
    en: {
      messages: {
        winter: 'Winter is coming'
      }
    }
  });

  expect(dict.hasMessage('en', 'winter')).toBe(true);
});

test('can fetch a message', () => {
  const dict = new Dictionary({
    en: {
      messages: {
        winter: 'Winter is coming'
      }
    }
  });

  expect(dict.getMessage('en', 'winter')).toBe('Winter is coming');
});

test('can check for attribute existance', () => {
  const dict = new Dictionary({
    en: {
      attributes: {
        email: 'Email Address'
      }
    }
  });

  expect(dict.hasAttribute('en', 'email')).toBe(true);
});

test('can fetch an attribute', () => {
  const dict = new Dictionary({
    en: {
      attributes: {
        email: 'Email Address'
      }
    }
  });

  expect(dict.getAttribute('en', 'email')).toBe('Email Address');
});

test('can set messages', () => {
  const dict = new Dictionary();
  dict.setMessage('en', 'winter', 'Winter is coming');

  expect(dict.getMessage('en', 'winter')).toBe('Winter is coming');
});

test('can set attributes', () => {
  const dict = new Dictionary({
    en: {
      attributes: {},
      messages: {}
    }
  });
  dict.setAttribute('en', 'email', 'Email Address');

  expect(dict.getAttribute('en', 'email')).toBe('Email Address');
  
  // test graceful population of non-existant directories.
  dict.setAttribute('fr', 'email', 'address');
  expect(dict.container.fr).toEqual({
    messages: {},
    attributes: {
      email: 'address'
    }
  });
});

test('returns the default message for the given locale when no fallback is provided', () => {
  const dict = new Dictionary({
    en: {
      messages: {
        _default: 'This is default'
      }
    },
    ar: {
      messages: {
        _default: 'رسالة افتراضية'
      }
    },
    fr: {
      messages: {}
    }
  });


  // default for locale
  expect(dict.getMessage('ar', 'any')).toBe('رسالة افتراضية');

  // no default message
  expect(dict.getMessage('fr', 'any')).toBe('This is default');
});

test('custom messages can be provided for specific fields', () => {
  const dict = new Dictionary({
    en: {
      messages: {
        alpha: 'not letters'
      }
    }
  });

  expect(dict.getMessage('en', 'alpha')).toBe('not letters');

  // test fallback
  expect(dict.getFieldMessage('en', 'name', 'alpha')).toBe('not letters');

  dict.merge({
    en: {
      custom: {
        name: {
          alpha: 'custom message'
        }
      }
    }
  });

  expect(dict.getFieldMessage('en', 'name', 'alpha')).toBe('custom message');
  expect(dict.getFieldMessage('fr', 'name', 'alpha')).toBe(undefined);
});

test('able to get and set date format attributes', () => {
  const dict = new Dictionary();
  dict.setDateFormat('en', 'MM/DD/YYYY');
  dict.setDateFormat('ar', 'DD/MM/YYYY');

  expect(dict.getDateFormat('en')).toBe('MM/DD/YYYY');
  expect(dict.getDateFormat('ar')).toBe('DD/MM/YYYY');
  expect(dict.getDateFormat('ru')).toBe(null);
});
