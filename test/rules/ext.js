import test from 'ava';
import validate from './../../src/rules/ext';
import mocks from './../helpers';


test('validates files extensions', t => {
    const params = ['txt', 'jpg', 'svg'];
    const validFiles = [
        mocks.file('file.txt', 'text/plain'),
        mocks.file('file.jpg', 'image/jpeg'),
        mocks.file('file.svg', 'image/svg'),
    ];

    t.true(validate(validFiles, params));
    t.false(validate([mocks.file('file.pdf', 'application/pdf')], params));
});
