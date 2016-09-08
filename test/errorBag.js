import test from 'ava';
import ErrorBag from './../src/errorBag';

test('it adds a new error', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');

    t.is(errors.first('name'), 'The name is invalid');
});

test('it adds a new error with a scope', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'scope1');

    t.is(errors.first('name', 'scope1'), 'The name is invalid');
});

test('it removes errors for a specific field', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');

    t.is(errors.count(), 3);
    errors.remove('name');
    t.is(errors.count(), 2);
    errors.remove('email');
    t.is(errors.count(), 0);
});

test('it removes errors for a specific field and scope', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'scope1');
    errors.add('email', 'The email is invalid', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'scope2');

    t.is(errors.count(), 3);
    errors.remove('email', 'scope1'); // remove the scope1 scoped field called email.
    t.is(errors.count(), 2);
    t.is(errors.first('email', 'scope2'), 'The email is shorter than 3 chars.');
});

test('it clears the errors', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');
    t.is(errors.count(), 3);
    errors.clear();
    t.is(errors.count(), 0);
});

test('it clears the errors within a scope', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'scope1');
    errors.add('email', 'The email is invalid', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'scope2');
    t.is(errors.count(), 3);
    errors.clear('scope1');
    t.is(errors.count(), 1);
});

test('it checks for field error existence', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    t.true(errors.has('name'));
    t.false(errors.has('email'));
});

test('it checks for scoped field error existence', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'scope1');

    t.true(errors.has('name'));
    t.true(errors.has('name', 'scope1'));
    t.false(errors.has('name', 'scope2')); // no such scoped field.
});

test('it fetches the errors count/length', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');

    t.is(errors.count(), 3);
});

test('it fetches the first error message for a specific field', t => {
    const errors = new ErrorBag();
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');

    t.is(errors.first('email'), 'The email is invalid');

    errors.clear();
    errors.add('email', 'The email is shorter than 3 chars.');

    t.is(errors.first('email'), 'The email is shorter than 3 chars.');
    t.is(errors.first('name'), null);
});

test('it fetches the first error message for a specific scoped field', t => {
    const errors = new ErrorBag();
    errors.add('email', 'The email is invalid', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'scope2');

    t.is(errors.first('email', 'scope1'), 'The email is invalid');
    t.is(errors.first('email', 'scope2'), 'The email is shorter than 3 chars.');
    t.is(errors.first('email', 'scope3'), null);
});

test('it returns all errors in an array', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');

    t.true(Array.isArray(errors.all()));
    t.deepEqual(errors.all(), [
        'The name is invalid',
        'The email is invalid',
        'The email is shorter than 3 chars.'
    ]);
});

test('it returns all scoped errors in an array', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'scope1');
    errors.add('email', 'The email is invalid', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'scope2');

    t.true(Array.isArray(errors.all()));
    t.deepEqual(errors.all('scope1'), [
        'The name is invalid',
        'The email is invalid'
    ]);
});

test('it collects errors for a specific field in an array', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');

    t.deepEqual(errors.collect('email'), [
        'The email is invalid',
        'The email is shorter than 3 chars.'
    ]);
    t.deepEqual(errors.collect('name'), [
        'The name is invalid'
    ]);
});

test('it collects errors for a specific field and scope', t => {
    const errors = new ErrorBag();
    errors.add('email', 'The email is not email.', 'scope1');
    errors.add('email', 'The email is invalid', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'scope2');

    t.deepEqual(errors.collect('email', 'scope1'), [
        'The email is not email.',
        'The email is invalid',
    ]);
    t.deepEqual(errors.collect('email', 'scope2'), [
        'The email is shorter than 3 chars.'
    ]);
});

test('it groups errors by field name', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');
    t.deepEqual(errors.collect(), {
        email: [
            'The email is invalid',
            'The email is shorter than 3 chars.'
        ],
        name: [
            'The name is invalid'
        ]
    });
});

test('it checks if there are any errors in the array', t => {
    const errors = new ErrorBag();
    t.false(errors.any());
    errors.add('name', 'The name is invalid');
    t.true(errors.any());
});

test('it checks if there are any errors within a scope in the array', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'scope1');
    errors.add('email', 'The email is invalid', 'scope1');

    t.false(errors.any('scope3'));
    t.true(errors.any('scope1'));
});
