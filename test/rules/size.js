import test from 'ava';
import validate from './../../src/rules/size';
import mocks from './../helpers';

test('validates file size', t => {
    const params = [15];
    t.true(validate([mocks.file('file.txt', 'text/plain', 10)], params));
    t.true(validate([mocks.file('file.txt', 'text/plain', 15)], params));
    t.false(validate([mocks.file('file.txt', 'text/plain', 16)], params));
    t.false(validate([mocks.file('file.txt', 'text/plain', 16)], ['not a number']));
});
