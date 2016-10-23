import Dictionary from './../src/dictionary';

it('does not merge if a non object is provided', () => {
    const dict = new Dictionary('a string');

    expect(dict.hasLocale('en')).toBe(false);
});

it('can check for locale existance', () => {
    const dict = new Dictionary({
        en: { }
    });

    expect(dict.hasLocale('en')).toBe(true);
    expect(dict.hasLocale('ar')).toBe(false);
});

it('can check for message existance', () => {
    const dict = new Dictionary({
        en: {
            messages: {
                winter: 'Winter is coming'
            }
        }
    });

    expect(dict.hasMessage('en', 'winter')).toBe(true);
});

it('can fetch a message', () => {
    const dict = new Dictionary({
        en: {
            messages: {
                winter: 'Winter is coming'
            }
        }
    });

    expect(dict.getMessage('en', 'winter')).toBe('Winter is coming');
});

it('can check for attribute existance', () => {
    const dict = new Dictionary({
        en: {
            attributes: {
                email: 'Email Address'
            }
        }
    });

    expect(dict.hasAttribute('en', 'email')).toBe(true);
});

it('can fetch an attribute', () => {
    const dict = new Dictionary({
        en: {
            attributes: {
                email: 'Email Address'
            }
        }
    });

    expect(dict.getAttribute('en', 'email')).toBe('Email Address');
});

it('can default to a fallback if message or attribute does not exist', () => {
    const dict = new Dictionary();

    expect(dict.getMessage('en', 'winter', 'Winter is still coming')).toBe('Winter is still coming');
    expect(dict.getAttribute('en', 'john', 'Knows nothing')).toBe('Knows nothing');
});

it('can set messages', () => {
    const dict = new Dictionary();
    dict.setMessage('en', 'winter', 'Winter is coming');

    expect(dict.getMessage('en', 'winter')).toBe('Winter is coming');
});

it('can set attributes', () => {
    const dict = new Dictionary();
    dict.setAttribute('en', 'email', 'Email Address');

    expect(dict.getAttribute('en', 'email')).toBe('Email Address');
});
