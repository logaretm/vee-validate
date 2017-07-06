import validate from './../../src/rules/image';
import mocks from './../helpers';

test('validates image files', () => {
    const validFiles = [
        mocks.file('file.gif', 'image/gif'),
        mocks.file('file.jpg', 'image/jpeg'),
        mocks.file('file.jpeg', 'image/jpeg'),
        mocks.file('file.svg', 'image/svg'),
        mocks.file('file.bmp', 'image/bmp'),
        mocks.file('file.png', 'image/png')
    ];

    expect(validate(validFiles)).toBe(true);
    expect(validate([mocks.file('file.pdf', 'application/pdf')])).toBe(false);
});
