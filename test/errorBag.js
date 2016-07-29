import test from 'ava';
import ErrorBag from './../src/errorBag';

test('it adds a new error', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');

    t.is(errors.first('name'), 'The name is invalid');
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


test('it clears the errors', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    errors.add('email', 'The email is invalid');
    errors.add('email', 'The email is shorter than 3 chars.');
    t.is(errors.count(), 3);
    errors.clear();
    t.is(errors.count(), 0);
});

test('it checks for field error existence', t => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid');
    t.true(errors.has('name'));
    t.false(errors.has('email'));
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
});
