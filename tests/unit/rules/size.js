import validate from './../../../src/rules/size';
import helpers from './../../helpers';

test('validates file size', () => {
    const params = [15];
    expect(validate([helpers.file('file.txt', 'text/plain', 10)], params)).toBe(true);
    expect(validate([helpers.file('file.txt', 'text/plain', 15)], params)).toBe(true);
    expect(validate([helpers.file('file.txt', 'text/plain', 16)], params)).toBe(false);
    expect(validate([helpers.file('file.txt', 'text/plain', 16)], ['not a number'])).toBe(false);
});
