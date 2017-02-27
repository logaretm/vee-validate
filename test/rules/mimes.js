import test from 'ava';
import validate from './../../src/rules/mimes';
import mocks from './../helpers';

test('validates mime types', t => {
    const params = ['image/*', 'text/plain'];

    t.true(validate([
        mocks.file('file.txt', 'text/plain'),
        mocks.file('file.jpg', 'image/jpeg'),
        mocks.file('file.svg', 'image/svg'),
    ], params));

    t.false(validate([mocks.file('file.pdf', 'application/pdf')], params));
});
