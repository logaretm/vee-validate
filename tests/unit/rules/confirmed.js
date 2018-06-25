import { validate } from '@/rules/confirmed';

test('validates a field confirmation', () => {
  expect(validate('p@$$word', 'p@$$word')).toBe(true);

  // fields do not match.
  expect(validate('password', 'p@$$word')).toBe(false);
});
