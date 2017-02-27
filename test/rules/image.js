import test from 'ava';
import validate from './../../src/rules/image';
import mocks from './../helpers';

test('validates image files', t => {
    const validFiles = [
        mocks.file('file.gif', 'image/gif'),
        mocks.file('file.jpg', 'image/jpeg'),
        mocks.file('file.jpeg', 'image/jpeg'),
        mocks.file('file.svg', 'image/svg'),
        mocks.file('file.bmp', 'image/bmp'),
        mocks.file('file.png', 'image/png')
    ];

    t.true(validate(validFiles));
    t.false(validate([mocks.file('file.pdf', 'application/pdf')]));
});
