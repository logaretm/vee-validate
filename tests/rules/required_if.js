import { validate } from '@/rules/required_if';

test('validates a conditional requirement', () => {
  // foo is not part of [bar, baz] -> field is not required & valid
  let test1 = validate('', ['foo', 'bar', 'baz']);
  expect(test1).toMatchObject({
    valid: true,
    data: { required: false }
  });

  // foo is part of [bar, foo, baz] -> field is required & invalid
  let test2 = validate('', ['foo', 'bar', 'foo', 'baz']);
  expect(test2).toMatchObject({
    valid: false,
    data: { required: true }
  });

  // foo is part of [bar, foo, baz] -> field is required & valid
  let test3 = validate('test', ['foo', 'bar', 'foo', 'baz']);
  expect(test3).toMatchObject({
    valid: true,
    data: { required: true }
  });
});
