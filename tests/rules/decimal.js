import { validate } from '@/rules/decimal';

test('validates numerics with decmial numbers', () => {
  const params = { decimals: 2 };

  expect(validate('11.223123818')).toBe(true);
  expect(validate(['11.223123818', '13.1231'])).toBe(true);
  expect(validate('11.223123818', {})).toBe(true);
  expect(validate('11.223123818', undefined)).toBe(true);
  expect(validate('11.223123818', [undefined])).toBe(true);
  expect(validate('11.2', params)).toBe(true);
  expect(validate('11.23', params)).toBe(true);
  expect(validate('-1', params)).toBe(true);
  expect(validate('11', params)).toBe(true);
  expect(validate('.11')).toBe(true);
  expect(validate('1', { decimails: 0 })).toBe(true);
  expect(validate('+1')).toBe(true);
  expect(validate('+1.2')).toBe(true);

  expect(validate('')).toBe(false);
  expect(validate(null)).toBe(false);
  expect(validate(undefined)).toBe(false);
  expect(validate('11.234', params)).toBe(false);
  expect(validate('1-', params)).toBe(false);
  expect(validate('1-1', params)).toBe(false);
  expect(validate('1-1.22', params)).toBe(false);
  expect(validate(['1-2.223123818', '1-3.1231'])).toBe(false);
  expect(validate('1+1')).toBe(false);
  expect(validate('1+')).toBe(false);
  expect(validate('a')).toBe(false);
  expect(validate('1.11', { decimals: 0 })).toBe(false);
});

test('decimal separator can be customized', () => {
  const params = { decimals: 2, separator: ',' };
  expect(validate('11.23', params)).toBe(false);
  expect(validate('11,23', params)).toBe(true);
});
