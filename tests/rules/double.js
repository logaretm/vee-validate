import { validate } from '@/rules/double';

const valid = [2.2, 1.1222, -2.32, '2.3333', 1, '1', '-2.4444'];
const invalid = ['', undefined, null, true, false, {}, '+32.32', 'a', '323ads232', '2..2'];

test('validates that the value contains a decimal number', () => {
  valid.forEach(value => expect(validate(value)).toBe(true));
  expect(validate(valid)).toBe(true);

  invalid.forEach(value => expect(validate(value)).toBe(false));
  expect(validate(invalid)).toBe(false);
});

test('validates that the contain a decimal number using a comma as seperator', () => {
  const replaceDot = val => String(val).replace(/\./g, ',');

  const param = { separator: 'comma' };
  const validComma = valid.map(replaceDot);
  const invalidComma = invalid.map(replaceDot);

  validComma.forEach(value => expect(validate(value, param)).toBe(true));
  expect(validate(validComma, param)).toBe(true);

  invalidComma.forEach(value => expect(validate(value, param)).toBe(false));
  expect(validate(invalidComma, param)).toBe(false);
});

test('validates that the contain a decimal number with a specific count of decimal places', () => {
  const param = { decimals: '2' };

  const localValid = [1.11, '1.11', '-1.11', -1.11, 1, -1, '1', '-1'];
  const localInvalid = [...invalid, 1.1, 1.111, -1.1, '-1.1111', '1.1111'];

  localValid.forEach(value => expect(validate(value, param)).toBe(true));
  expect(validate(localValid, param)).toBe(true);

  localInvalid.forEach(value => expect(validate(value, param)).toBe(false));
  expect(validate(localInvalid, param)).toBe(false);
});
