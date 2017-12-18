import validate from './../../../src/rules/ext';
import helpers from './../../helpers';


test('validates files extensions', () => {
    const params = ['txt', 'jpg', 'svg'];
    const validFiles = [
        helpers.file('file.txt', 'text/plain'),
        helpers.file('file.jpg', 'image/jpeg'),
        helpers.file('file.svg', 'image/svg'),
    ];

    expect(validate(validFiles, params)).toBe(true);
    expect(validate([helpers.file('file.pdf', 'application/pdf')], params)).toBe(false);
});
