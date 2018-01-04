import validate from './../../../src/rules/image';
import helpers from './../../helpers';

test('validates image files', () => {
    const validFiles = [
        helpers.file('file.gif', 'image/gif'),
        helpers.file('file.jpg', 'image/jpeg'),
        helpers.file('file.jpeg', 'image/jpeg'),
        helpers.file('file.svg', 'image/svg'),
        helpers.file('file.bmp', 'image/bmp'),
        helpers.file('file.png', 'image/png')
    ];

    expect(validate(validFiles)).toBe(true);
    expect(validate([helpers.file('file.pdf', 'application/pdf')])).toBe(false);
});
