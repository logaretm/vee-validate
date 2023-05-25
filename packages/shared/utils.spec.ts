import { getTag, isPlainObject } from './utils';

describe('getTag()', () => {
  test('should return [object Undefined] for undefined type', () => {
    const tag = getTag(undefined);

    expect(tag).toBe('[object Undefined]');
  });

  test('should return [object Null] for null type', () => {
    const tag = getTag(null);

    expect(tag).toBe('[object Null]');
  });
});

describe('isPlainObject()', () => {
  test('should return true if object has no prototype', () => {
    const result = isPlainObject(Object.create(null));

    expect(result).toBe(true);
  });
});
