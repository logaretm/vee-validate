import validate from './../../../src/rules/url';

/**
 * most test cases are from https://mathiasbynens.be/demo/url-regex.
 */

const valid = [
    'https://foo.com/blah_blah',
    'http://foo.com/blah_blah',
    'http://foo.com/blah_blah/',
    'http://foo.com/blah_blah_(wikipedia)',
    'http://foo.com/blah_blah_(wikipedia)_(again)',
    'http://j.mp',
    'http://foo.bar/%20URL-encoded%20stuff',
    'http://1337.net',
    'http://a.b-c.de'
];

const invalid = [
    'http://',
    'http://.',
    'http://..',
    'http://../',
    'http://?',
    'http://??',
    'http://??/',
    'http://#',
    'http://##',
    'http://##/',
    'http://foo.bar?q=Spaces should be encoded',
    '//',
    '//a',
    '///a',
    '///',
    'http:///a',
    'rdar://1234',
    'h://test',
    'http:// shouldfail.com',
    ':// should fail',
    'http://foo.bar/foo(bar)baz quux',
    'ftps://foo.bar/',
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
];

test('should validate urls', () => {
    expect.assertions(40);
    // check valid urls.
    valid.forEach(url => expect(validate(url)).toBe(true));
    expect(validate(valid)).toBe(true);

    // check invalid urls.
    invalid.forEach(url => expect(validate(url)).toBe(false));
    expect(validate(invalid)).toBe(false);

    // test require protocol.
    expect(validate('google.com', [true])).toBe(false);
    expect(validate('https://google.com', [true])).toBe(true);
    expect(validate('google.com', [false])).toBe(true);
    expect(validate('https://google.com', [false])).toBe(true);
});


test('normalizes undefined and null to empty strings', () => {
    expect(validate(null)).toBe(false);
    expect(validate(undefined)).toBe(false);
});