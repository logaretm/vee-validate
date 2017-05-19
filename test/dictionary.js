import test from 'ava';
import Dictionary from './../src/dictionary';

test('does not merge if a non object is provided', t => {
  const dict = new Dictionary('a string');

  t.is(dict.hasLocale('en'), false);
});

test('can check for locale existance', t => {
  const dict = new Dictionary({
    en: { }
  });

  t.is(dict.hasLocale('en'), true);
  t.is(dict.hasLocale('ar'), false);
});

test('can check for message existance', t => {
  const dict = new Dictionary({
    en: {
      messages: {
        winter: 'Winter is coming'
      }
    }
  });

  t.is(dict.hasMessage('en', 'winter'), true);
});

test('can fetch a message', t => {
  const dict = new Dictionary({
    en: {
      messages: {
        winter: 'Winter is coming'
      }
    }
  });

  t.is(dict.getMessage('en', 'winter'), 'Winter is coming');
});

test('can check for attribute existance', t => {
  const dict = new Dictionary({
    en: {
      attributes: {
        email: 'Email Address'
      }
    }
  });

  t.is(dict.hasAttribute('en', 'email'), true);
});

test('can fetch an attribute', t => {
  const dict = new Dictionary({
    en: {
      attributes: {
        email: 'Email Address'
      }
    }
  });

  t.is(dict.getAttribute('en', 'email'), 'Email Address');
});

test('can default to a fallback if message or attribute does not exist', t => {
  const dict = new Dictionary();

  t.is(dict.getMessage('en', 'winter', 'Winter is still coming'), 'Winter is still coming');
  t.is(dict.getAttribute('en', 'john', 'Knows nothing'), 'Knows nothing');
});

test('can set messages', t => {
  const dict = new Dictionary();
  dict.setMessage('en', 'winter', 'Winter is coming');

  t.is(dict.getMessage('en', 'winter'), 'Winter is coming');
});

test('can set attributes', t => {
  const dict = new Dictionary();
  dict.setAttribute('en', 'email', 'Email Address');

  t.is(dict.getAttribute('en', 'email'), 'Email Address');
});

test('returns the default message for the given locale when no fallback is provided', t => {
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
  t.is(dict.getMessage('ar', 'any'), 'رسالة افتراضية');

  // no default message
  t.is(dict.getMessage('fr', 'any'), 'This is default');
});

test('custom messages can be provided for specific fields', t => {
  const dict = new Dictionary({
    en: {
      messages: {
        alpha: 'not letters'
      }
    }
  });

  t.is(dict.getMessage('en', 'alpha'), 'not letters');

  // test fallback
  t.is(dict.getFieldMessage('en', 'name', 'alpha'), 'not letters');

  dict.merge({
    en: {
      custom: {
        name: {
          alpha: 'custom message'
        }
      }
    }
  });

  t.is(dict.getFieldMessage('en', 'name', 'alpha'), 'custom message');
});
