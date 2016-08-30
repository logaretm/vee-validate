import test from 'ava';
import Dictionary from './../src/dictionary';

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
