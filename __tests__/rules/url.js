import validate from './../../src/rules/url';

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
    'http://0.0.0.0',
    'http://10.1.1.0',
    'http://10.1.1.255',
    'http://224.1.1.1',
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
];

it('should validate urls', () => {
    // check valid urls.
    valid.forEach(url => expect(validate(url)).toBe(true));

    // check invalid urls.
    invalid.forEach(url => expect(validate(url)).toBe(false));

    // test domains.
    expect(validate('https://google.com/maps', ['google.com'])).toBe(true);
    expect(validate('https://maps.google.com/', ['google.com'])).toBe(true);
    expect(validate('https://yahoo.com/maps', ['google.com'])).toBe(false);
});
