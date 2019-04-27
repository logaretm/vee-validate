import { validate } from '@/rules/confirmed';

test('validates a field confirmation', () => {
  expect(validate('p@$$word', { target: 'p@$$word' })).toBe(true);

  // fields do not match.
  expect(validate('password', { target: 'p@$$word' })).toBe(false);
});
