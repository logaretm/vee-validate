import { validate } from '@/rules/confirmed';

test('validates a field confirmation', () => {
  expect(validate('p@$$word', { targetValue: 'p@$$word' })).toBe(true);

  // fields do not match.
  expect(validate('password', { targetValue: 'p@$$word' })).toBe(false);
});
