import validate from './../../src/rules/is';

test('checks if the value matches another', () => {
  expect(validate(1, ['1'])).toBe(false);
  expect(validate(1, [1])).toBe(true);
});
