import { validate } from '@/rules/ip_or_fqdn';

test('validates that the string is a valid ipv4 address', () => {
  // valid.
  ['192.168.1.1', '255.255.255.255'].forEach(value => expect(validate(value)).toBe(true));
  expect(validate(['192.168.1.1', '255.255.255.255'])).toBe(true);

  // invalid
  ['192.168.a.1', '255.255.255.256', '23.a.f.234'].forEach(value => expect(validate(value)).toBe(false));
  expect(validate(['192.168.a.1', '255.255.255.256', '23.a.f.234'])).toBe(false);
});

test('validates that the string is a valid ipv6 address', () => {
  // valid.
  [
    '::1',
    '2001:db8:0000:1:1:1:1:1',
    '::ffff:127.0.0.1'
  ].forEach(value => expect(validate(value)).toBe(true));
  expect(validate([
    '::1',
    '2001:db8:0000:1:1:1:1:1',
    '::ffff:127.0.0.1'
  ], { version: 6 })).toBe(true);

  // invalid
  [
    '127.0.0.1',
    '0.0.0.0',
    '255.255.255.255',
    '1.2.3.4',
    '::ffff:287.0.0.1',
  ].forEach(value => expect(validate(value)).toBe(false));
  expect(validate([
    '127.0.0.1',
    '0.0.0.0',
    '255.255.255.255',
    '1.2.3.4',
    '::ffff:287.0.0.1',
  ])).toBe(false);
});

test('validates that the string is a valid fully qualified domain name', () => {
  // valid.
  [
    'google.com',
    'www.wikipedia.org',
    'amazon.co.uk'
  ].forEach(value => expect(validate(value)).toBe(true));
  expect(validate([
    'google.com',
    'www.wikipedia.org',
    'amazon.co.uk'
  ])).toBe(true);

  // invalid
  [
    'rubbish',
    'abc 123',
    '.com',
  ].forEach(value => expect(validate(value)).toBe(false));
  expect(validate([
    'rubbish',
    'abc 123',
    '.com',
  ])).toBe(false);
});

test('normalizes undefined or null to empty strings', () => {
  expect(validate(null)).toBe(false);
  expect(validate(undefined)).toBe(false);
});
