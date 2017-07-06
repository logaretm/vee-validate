import validate from './../../src/rules/ext';
import mocks from './../helpers';


test('validates files extensions', () => {
    const params = ['txt', 'jpg', 'svg'];
    const validFiles = [
        mocks.file('file.txt', 'text/plain'),
        mocks.file('file.jpg', 'image/jpeg'),
        mocks.file('file.svg', 'image/svg'),
    ];

    expect(validate(validFiles, params)).toBe(true);
    expect(validate([mocks.file('file.pdf', 'application/pdf')], params)).toBe(false);
});
