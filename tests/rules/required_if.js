import { validate } from '@/rules/required_if';

test('validates a conditional requirement', () => {
  // foo is not part of [bar, baz] -> field is not required & valid
  let test1 = validate('', { target: 'foo', values: ['bar', 'baz'] });
  expect(test1).toMatchObject({
    valid: true,
    data: { required: false }
  });

  // foo is part of [bar, foo, baz] -> field is required & invalid
  let test2 = validate('', { target: 'foo', values: ['bar', 'baz', 'foo'] });
  expect(test2).toMatchObject({
    valid: false,
    required: true
  });

  // foo is part of [bar, foo, baz] -> field is required & valid
  let test3 = validate('test', { target: 'foo', values: ['bar', 'baz', 'foo'] });
  expect(test3).toMatchObject({
    valid: true,
    required: true
  });
});
