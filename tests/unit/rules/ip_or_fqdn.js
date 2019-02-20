import { validate } from '@/rules/ip_or_fqdn';

test('validates that the string is a valid ipv4 or ipv6 address or a valid fqdn', () => {
  // valid.
  [
    '192.168.1.1',
    '255.255.255.255',
    '::1',
    '2001:db8:0000:1:1:1:1:1',
    '::ffff:127.0.0.1',
    'google.com',
    'www.wikipedia.org',
    'amazon.co.uk'
  ].forEach(value => expect(validate(value)).toBe(true));
  expect(validate([
    '192.168.1.1',
    '255.255.255.255',
    '::1',
    '2001:db8:0000:1:1:1:1:1',
    '::ffff:127.0.0.1',
    'google.com',
    'www.wikipedia.org',
    'amazon.co.uk'
  ])).toBe(true);

  // invalid
  [
    '192.168.a.1',
    '255.255.255.256',
    '23.a.f.234',
    '::ffff:287.0.0.1',
    '1:2:3:4:5:6:7:8:9',
    'rubbish',
    'abc 123.com',
    'too..many.dots',
    '.com'
  ].forEach(value => expect(validate(value)).toBe(false));
  expect(validate([
    '192.168.a.1',
    '255.255.255.256',
    '23.a.f.234',
    '::ffff:287.0.0.1',
    '1:2:3:4:5:6:7:8:9',
    'rubbish',
    'abc 123.com',
    'too..many.dots',
    '.com'
  ])).toBe(false);
});

test('normalizes undefined or null to empty strings', () => {
  expect(validate(null)).toBe(false);
  expect(validate(undefined)).toBe(false);
});
