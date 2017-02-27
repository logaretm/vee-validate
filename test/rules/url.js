import test from 'ava';
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
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
];

test('should validate urls', t => {
    t.plan(38);
    // check valid urls.
    valid.forEach(url => t.true(validate(url)));

    // check invalid urls.
    invalid.forEach(url => {
        t.false(validate(url));
    });

    // test require protocol.
    t.false(validate('google.com', [true]));
    t.true(validate('https://google.com', [true]));
    t.true(validate('google.com', [false]));
    t.true(validate('https://google.com', [false]));
});
