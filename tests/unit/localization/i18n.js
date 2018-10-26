import Dictionary from '@/localization/i18n';
import VueI18n from 'vue-i18n';
import { createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(VueI18n);

test('initialization', () => {
  const i18n = new VueI18n();
  const dictionary = new Dictionary(i18n, 'validation');

  expect(dictionary.i18n).toBe(i18n);
  expect(dictionary.rootKey).toBe('validation');
});

test('get locale property', () => {
  const i18n = new VueI18n({
    locale: 'en'
  });
  const dictionary = new Dictionary(i18n, 'validation');
  expect(dictionary.locale).toBe('en');
});

test('set locale property emits a warning', () => {
  const i18n = new VueI18n({
    locale: 'en'
  });
  global.console.warn = jest.fn();
  const dictionary = new Dictionary(i18n, 'validation');
  dictionary.locale = 'ar';
  expect(global.console.warn).toHaveBeenCalled();
});

test('gets messsages', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {
        validation: {
          messages: {
            _default: '{0} is invalid',
            required: 'oops {0} is wrong'
          }
        }
      }
    }
  });
  const dictionary = new Dictionary(i18n, 'validation');
  expect(dictionary.getMessage('en', 'required', ['field'])).toBe('oops field is wrong');

  // test default fallback
  expect(dictionary.getMessage('en', 'alpha', ['field'])).toBe('field is invalid');
});

test('sets messsages', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {
        validation: {
          messages: {
            required: 'oops {0} is wrong'
          }
        }
      }
    }
  });
  const dictionary = new Dictionary(i18n, 'validation');
  // sets them in vue-18n list format
  dictionary.setMessage('en', 'required', 'WRONG! {0} IS WRONG!');
  expect(dictionary.getMessage('en', 'required', ['field'])).toBe('WRONG! field IS WRONG!');

  // sets them in vee-validate format
  dictionary.setMessage('en', 'required', (field, [param]) => {
    return `OOPS ${field} is invalid because ${param}`;
  });
  expect(
    dictionary.getMessage('en', 'required', ['field', ['val']])
  ).toBe('OOPS field is invalid because val');
});

test('gets attributes', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {
        validation: {
          attributes: {
            name: 'Full Name'
          }
        }
      },
      fr: {
        validation: {
          attributes: {
            name: 'prenom'
          }
        }
      }
    }
  });

  const dictionary = new Dictionary(i18n, 'validation');
  // sets them in vue-18n list format
  expect(dictionary.getAttribute(null, 'name')).toBe('Full Name');

  // test fallback attribute
  expect(dictionary.getAttribute(null, 'email', 'fallback')).toBe('fallback');

  // test different locale
  i18n.locale = 'fr';
  expect(dictionary.getAttribute(null, 'name')).toBe('prenom');
});

test('sets attributes', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {
        validation: {}
      }
    }
  });

  const dictionary = new Dictionary(i18n, 'validation');
  // sets them in vue-18n list format
  dictionary.setAttribute('en', 'name', 'First Name');

  // test fallback attribute
  expect(dictionary.getAttribute('en', 'name')).toBe('First Name');
});

test('gets date format', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {}
    }
  });

  i18n.setDateTimeFormat('en', 'DD-MM-YYYY');
  const dictionary = new Dictionary(i18n, 'validation');
  expect(dictionary.getDateFormat('en')).toBe('DD-MM-YYYY');
});

test('sets date format', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {}
    }
  });

  const dictionary = new Dictionary(i18n, 'validation');
  dictionary.setDateFormat('en', 'MM-DD-YYYY');
  expect(dictionary.getDateFormat('en')).toBe('MM-DD-YYYY');
});

describe('gets field specifc messages', () => {
  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {
        validation: {
          messages: {
            required: 'default required message'
          },
          custom: {
            email: {
              required: 'EMAIL ADDRESS IS REQUIRED'
            }
          }
        }
      }
    }
  });
  const dictionary = new Dictionary(i18n, 'validation');

  test('if field exists', () => {
    expect(dictionary.getFieldMessage('en', 'email', 'required', [])).toBe('EMAIL ADDRESS IS REQUIRED');
  });

  test('fallsback to the default message for the rule', () => {
    expect(dictionary.getFieldMessage('en', 'name', 'required', [])).toBe('default required message');
  });
});

test('merges dictionaries and locale messages', () => {
  const dict = {
    ar: {
      messages: {
        required: 'matloub'
      }
    },
    en: {
      dateFormat: 'dd-mm-yyyy',
      messages: {
        required: 'required'
      },
      attributes: {
        email: 'Email address'
      },
      custom: {
        email: {
          required: 'email is required'
        }
      }
    }
  };

  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {
        validation: {
          messages: {
            alpha: 'Must be alpha DendiFace' // twitch meme
          }
        }
      }
    }
  });

  const dictionary = new Dictionary(i18n, 'validation');
  dictionary.merge(dict);

  expect(dictionary.getMessage(null, 'required', [])).toBe('required');
  i18n.locale = 'ar';
  expect(dictionary.getMessage(null, 'required', [])).toBe('matloub');
  i18n.locale = 'en';
  expect(dictionary.getMessage(null, 'alpha', [])).toBe('Must be alpha DendiFace');
  expect(dictionary.getFieldMessage(null, 'email', 'required', [])).toBe('email is required');
  expect(dictionary.getAttribute(null, 'email')).toBe('Email address');
  expect(dictionary.getDateFormat(null)).toBe('dd-mm-yyyy');
});

test('fallback locale', () => {
  const dict = {
    ar: {
      messages: {
        required: 'مطلوب'
      }
    }
  };

  const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'ar'
  });

  const dictionary = new Dictionary(i18n, 'validation');
  dictionary.merge(dict);

  expect(dictionary.getMessage('en', 'required')).toBe('مطلوب');
});
