import { validate } from '@/rules/required_if';

test('validates a conditional requirement', () => {
  // foo is not part of [bar, baz] -> field is not required & valid
  const test1 = validate('', { target: 'foo', values: ['bar', 'baz'] });
  expect(test1).toMatchObject({
    valid: true,
    required: false
  });

  // foo is part of [bar, foo, baz] -> field is required & invalid
  const test2 = validate('', { target: 'foo', values: ['bar', 'baz', 'foo'] });
  expect(test2).toMatchObject({
    valid: false,
    required: true
  });

  // foo is part of [bar, foo, baz] -> field is required & valid
  const test3 = validate('test', { target: 'foo', values: ['bar', 'baz', 'foo'] });
  expect(test3).toMatchObject({
    valid: true,
    required: true
  });

  // test case for non-strings.
  const test4 = validate('', { target: '0', values: [0, 1, null] });
  expect(test4).toMatchObject({
    valid: false,
    required: true
  });

  // test case for empty values and empty target value.
  const test5 = validate('', { target: '' });
  expect(test5).toMatchObject({
    valid: true,
    required: false
  });

  // test case for empty values and present target value.
  const test6 = validate('', { target: '1' });
  expect(test6).toMatchObject({
    valid: false,
    required: true
  });

  // test case for empty values and present target value and empty values.
  const test7 = validate('', { target: '1', values: [] });
  expect(test7).toMatchObject({
    valid: false,
    required: true
  });

  // test case for empty values and empty target value and present and empty values.
  const test8 = validate('', { target: '', values: [] });
  expect(test8).toMatchObject({
    valid: true,
    required: false
  });
});
