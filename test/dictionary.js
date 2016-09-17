import test from 'ava';
import Dictionary from './../src/dictionary';

test('it does not merge if a non object is provided', t => {
    const dict = new Dictionary('a string');

    t.false(dict.hasLocale('en'));
});

test('it can check for locale existance', t => {
    const dict = new Dictionary({
        en: { }
    });

    t.true(dict.hasLocale('en'));
    t.false(dict.hasLocale('ar'));
});

test('it can check for message existance', t => {
    const dict = new Dictionary({
        en: {
            messages: {
                winter: 'Winter is coming'
            }
        }
    });

    t.true(dict.hasMessage('en', 'winter'));
});

test('it can fetch a message', t => {
    const dict = new Dictionary({
        en: {
            messages: {
                winter: 'Winter is coming'
            }
        }
    });

    t.is(dict.getMessage('en', 'winter'), 'Winter is coming');
});

test('it should use the polyfill if object.assign does not exist', t => {
    const assign = Object.assign;
    Object.assign = undefined;

    const dict = new Dictionary({
        en: {
            messages: {
                winter: 'Winter is coming'
            }
        }
    });

    t.is(dict.getMessage('en', 'winter'), 'Winter is coming');

    Object.assign = assign;
});

test('it can check for attribute existance', t => {
    const dict = new Dictionary({
        en: {
            attributes: {
                email: 'Email Address'
            }
        }
    });

    t.true(dict.hasAttribute('en', 'email'));
});

test('it can fetch an attribute', t => {
    const dict = new Dictionary({
        en: {
            attributes: {
                email: 'Email Address'
            }
        }
    });

    t.is(dict.getAttribute('en', 'email'), 'Email Address');
});

test('it can default to a fallback if message or attribute does not exist', t => {
    const dict = new Dictionary();
    t.is(
        dict.getMessage('en', 'winter', 'Winter is still coming'),
        'Winter is still coming'
    );
    t.is(
        dict.getAttribute('en', 'john', 'Knows nothing'),
        'Knows nothing'
    );
});

test('it can set messages', t => {
    const dict = new Dictionary();
    dict.setMessage('en', 'winter', 'Winter is coming');

    t.is(dict.getMessage('en', 'winter'), 'Winter is coming');
});

test('it can set attributes', t => {
    const dict = new Dictionary();
    dict.setAttribute('en', 'email', 'Email Address');

    t.is(dict.getAttribute('en', 'email'), 'Email Address');
});
