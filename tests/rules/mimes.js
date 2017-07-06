import validate from './../../src/rules/mimes';
import mocks from './../helpers';

test('validates mime types', () => {
    const params = ['image/*', 'text/plain'];

    expect(validate([
        mocks.file('file.txt', 'text/plain'),
        mocks.file('file.jpg', 'image/jpeg'),
        mocks.file('file.svg', 'image/svg'),
    ], params)).toBe(true);

    expect(validate([mocks.file('file.pdf', 'application/pdf')], params)).toBe(false);
});
