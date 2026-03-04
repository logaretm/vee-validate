import { isEqual, isStandardSchema } from 'packages/vee-validate/src/utils';

describe('assertions', () => {
  test('equal objects are equal', () => {
    const a1 = { field1: undefined, field2: 'value2', field3: 'value3' };
    const a2 = { field1: undefined, field3: 'value3', field2: 'value2' };
    const a3 = { field2: 'value2', field3: 'value3', field1: undefined };
    const a4 = { field2: 'value2', field1: undefined, field3: 'value3' };
    const a5 = { field3: 'value3', field1: undefined, field2: 'value2' };
    const a6 = { field3: 'value3', field2: 'value2', field1: undefined };

    const b1 = { field1: undefined, field2: 'value2', field3: 'value3' };
    const b2 = { field1: undefined, field3: 'value3', field2: 'value2' };
    const b3 = { field2: 'value2', field3: 'value3', field1: undefined };
    const b4 = { field2: 'value2', field1: undefined, field3: 'value3' };
    const b5 = { field3: 'value3', field1: undefined, field2: 'value2' };
    const b6 = { field3: 'value3', field2: 'value2', field1: undefined };

    expect(isEqual(a1, b1)).toBe(true);
    expect(isEqual(a1, b2)).toBe(true);
    expect(isEqual(a1, b3)).toBe(true);
    expect(isEqual(a1, b4)).toBe(true);
    expect(isEqual(a1, b5)).toBe(true);
    expect(isEqual(a1, b6)).toBe(true);

    expect(isEqual(a2, b1)).toBe(true);
    expect(isEqual(a2, b2)).toBe(true);
    expect(isEqual(a2, b3)).toBe(true);
    expect(isEqual(a2, b4)).toBe(true);
    expect(isEqual(a2, b5)).toBe(true);
    expect(isEqual(a2, b6)).toBe(true);

    expect(isEqual(a3, b1)).toBe(true);
    expect(isEqual(a3, b2)).toBe(true);
    expect(isEqual(a3, b3)).toBe(true);
    expect(isEqual(a3, b4)).toBe(true);
    expect(isEqual(a3, b5)).toBe(true);
    expect(isEqual(a3, b6)).toBe(true);

    expect(isEqual(a4, b1)).toBe(true);
    expect(isEqual(a4, b2)).toBe(true);
    expect(isEqual(a4, b3)).toBe(true);
    expect(isEqual(a4, b4)).toBe(true);
    expect(isEqual(a4, b5)).toBe(true);
    expect(isEqual(a4, b6)).toBe(true);

    expect(isEqual(a5, b1)).toBe(true);
    expect(isEqual(a5, b2)).toBe(true);
    expect(isEqual(a5, b3)).toBe(true);
    expect(isEqual(a5, b4)).toBe(true);
    expect(isEqual(a5, b5)).toBe(true);
    expect(isEqual(a5, b6)).toBe(true);

    expect(isEqual(a6, b1)).toBe(true);
    expect(isEqual(a6, b2)).toBe(true);
    expect(isEqual(a6, b3)).toBe(true);
    expect(isEqual(a6, b4)).toBe(true);
    expect(isEqual(a6, b5)).toBe(true);
    expect(isEqual(a6, b6)).toBe(true);
  });

  test('equal objects where A has missing keys are equal', () => {
    const a1 = { field2: 'value2', field3: 'value3' };
    const a2 = { field3: 'value3', field2: 'value2' };

    const b1 = { field1: undefined, field2: 'value2', field3: 'value3' };
    const b2 = { field1: undefined, field3: 'value3', field2: 'value2' };
    const b3 = { field2: 'value2', field3: 'value3', field1: undefined };
    const b4 = { field2: 'value2', field1: undefined, field3: 'value3' };
    const b5 = { field3: 'value3', field1: undefined, field2: 'value2' };
    const b6 = { field3: 'value3', field2: 'value2', field1: undefined };

    expect(isEqual(a1, b1)).toBe(true);
    expect(isEqual(a1, b2)).toBe(true);
    expect(isEqual(a1, b3)).toBe(true);
    expect(isEqual(a1, b4)).toBe(true);
    expect(isEqual(a1, b5)).toBe(true);
    expect(isEqual(a1, b6)).toBe(true);

    expect(isEqual(a2, b1)).toBe(true);
    expect(isEqual(a2, b2)).toBe(true);
    expect(isEqual(a2, b3)).toBe(true);
    expect(isEqual(a2, b4)).toBe(true);
    expect(isEqual(a2, b5)).toBe(true);
    expect(isEqual(a2, b6)).toBe(true);
  });

  test('equal objects where B has missing keys are equal', () => {
    const a1 = { field1: undefined, field2: 'value2', field3: 'value3' };
    const a2 = { field1: undefined, field3: 'value3', field2: 'value2' };
    const a3 = { field2: 'value2', field3: 'value3', field1: undefined };
    const a4 = { field2: 'value2', field1: undefined, field3: 'value3' };
    const a5 = { field3: 'value3', field1: undefined, field2: 'value2' };
    const a6 = { field3: 'value3', field2: 'value2', field1: undefined };

    const b1 = { field2: 'value2', field3: 'value3' };
    const b2 = { field3: 'value3', field2: 'value2' };

    expect(isEqual(a1, b1)).toBe(true);
    expect(isEqual(a1, b2)).toBe(true);

    expect(isEqual(a2, b1)).toBe(true);
    expect(isEqual(a2, b2)).toBe(true);

    expect(isEqual(a3, b1)).toBe(true);
    expect(isEqual(a3, b2)).toBe(true);

    expect(isEqual(a4, b1)).toBe(true);
    expect(isEqual(a4, b2)).toBe(true);

    expect(isEqual(a5, b1)).toBe(true);
    expect(isEqual(a5, b2)).toBe(true);

    expect(isEqual(a6, b1)).toBe(true);
    expect(isEqual(a6, b2)).toBe(true);
  });

  test('different objects are not equal', () => {
    const a1 = { field1: undefined, field2: 'value2', field3: 'value3' };
    const a2 = { field1: undefined, field3: 'value3', field2: 'value2' };
    const a3 = { field2: 'value2', field3: 'value3', field1: undefined };
    const a4 = { field2: 'value2', field1: undefined, field3: 'value3' };
    const a5 = { field3: 'value3', field1: undefined, field2: 'value2' };
    const a6 = { field3: 'value3', field2: 'value2', field1: undefined };

    const b1 = { field1: undefined, field2: 'value2', field3: 'DIFF' };
    const b2 = { field1: undefined, field3: 'DIFF', field2: 'value2' };
    const b3 = { field2: 'value2', field3: 'DIFF', field1: undefined };
    const b4 = { field2: 'value2', field1: undefined, field3: 'DIFF' };
    const b5 = { field3: 'DIFF', field1: undefined, field2: 'value2' };
    const b6 = { field3: 'DIFF', field2: 'value2', field1: undefined };

    expect(isEqual(a1, b1)).toBe(false);
    expect(isEqual(a1, b2)).toBe(false);
    expect(isEqual(a1, b3)).toBe(false);
    expect(isEqual(a1, b4)).toBe(false);
    expect(isEqual(a1, b5)).toBe(false);
    expect(isEqual(a1, b6)).toBe(false);

    expect(isEqual(a2, b1)).toBe(false);
    expect(isEqual(a2, b2)).toBe(false);
    expect(isEqual(a2, b3)).toBe(false);
    expect(isEqual(a2, b4)).toBe(false);
    expect(isEqual(a2, b5)).toBe(false);
    expect(isEqual(a2, b6)).toBe(false);

    expect(isEqual(a3, b1)).toBe(false);
    expect(isEqual(a3, b2)).toBe(false);
    expect(isEqual(a3, b3)).toBe(false);
    expect(isEqual(a3, b4)).toBe(false);
    expect(isEqual(a3, b5)).toBe(false);
    expect(isEqual(a3, b6)).toBe(false);

    expect(isEqual(a4, b1)).toBe(false);
    expect(isEqual(a4, b2)).toBe(false);
    expect(isEqual(a4, b3)).toBe(false);
    expect(isEqual(a4, b4)).toBe(false);
    expect(isEqual(a4, b5)).toBe(false);
    expect(isEqual(a4, b6)).toBe(false);

    expect(isEqual(a5, b1)).toBe(false);
    expect(isEqual(a5, b2)).toBe(false);
    expect(isEqual(a5, b3)).toBe(false);
    expect(isEqual(a5, b4)).toBe(false);
    expect(isEqual(a5, b5)).toBe(false);
    expect(isEqual(a5, b6)).toBe(false);

    expect(isEqual(a6, b1)).toBe(false);
    expect(isEqual(a6, b2)).toBe(false);
    expect(isEqual(a6, b3)).toBe(false);
    expect(isEqual(a6, b4)).toBe(false);
    expect(isEqual(a6, b5)).toBe(false);
    expect(isEqual(a6, b6)).toBe(false);
  });

  test('different objects where A has missing keys are not equal', () => {
    const a1 = { field2: 'value2', field3: 'value3' };
    const a2 = { field3: 'value3', field2: 'value2' };

    const b1 = { field1: undefined, field2: 'value2', field3: 'DIFF' };
    const b2 = { field1: undefined, field3: 'DIFF', field2: 'value2' };
    const b3 = { field2: 'value2', field3: 'DIFF', field1: undefined };
    const b4 = { field2: 'value2', field1: undefined, field3: 'DIFF' };
    const b5 = { field3: 'DIFF', field1: undefined, field2: 'value2' };
    const b6 = { field3: 'DIFF', field2: 'value2', field1: undefined };

    expect(isEqual(a1, b1)).toBe(false);
    expect(isEqual(a1, b2)).toBe(false);
    expect(isEqual(a1, b3)).toBe(false);
    expect(isEqual(a1, b4)).toBe(false);
    expect(isEqual(a1, b5)).toBe(false);
    expect(isEqual(a1, b6)).toBe(false);

    expect(isEqual(a2, b1)).toBe(false);
    expect(isEqual(a2, b2)).toBe(false);
    expect(isEqual(a2, b3)).toBe(false);
    expect(isEqual(a2, b4)).toBe(false);
    expect(isEqual(a2, b5)).toBe(false);
    expect(isEqual(a2, b6)).toBe(false);
  });

  test('different objects where B has missing keys not equal', () => {
    const a1 = { field1: undefined, field2: 'value2', field3: 'value3' };
    const a2 = { field1: undefined, field3: 'value3', field2: 'value2' };
    const a3 = { field2: 'value2', field3: 'value3', field1: undefined };
    const a4 = { field2: 'value2', field1: undefined, field3: 'value3' };
    const a5 = { field3: 'value3', field1: undefined, field2: 'value2' };
    const a6 = { field3: 'value3', field2: 'value2', field1: undefined };

    const b1 = { field2: 'value2', field3: 'DIFF' };
    const b2 = { field3: 'DIFF', field2: 'value2' };

    expect(isEqual(a1, b1)).toBe(false);
    expect(isEqual(a1, b2)).toBe(false);

    expect(isEqual(a2, b1)).toBe(false);
    expect(isEqual(a2, b2)).toBe(false);

    expect(isEqual(a3, b1)).toBe(false);
    expect(isEqual(a3, b2)).toBe(false);

    expect(isEqual(a4, b1)).toBe(false);
    expect(isEqual(a4, b2)).toBe(false);

    expect(isEqual(a5, b1)).toBe(false);
    expect(isEqual(a5, b2)).toBe(false);

    expect(isEqual(a6, b1)).toBe(false);
    expect(isEqual(a6, b2)).toBe(false);
  });
});

// #5110 - arktype compatibility
describe('isStandardSchema', () => {
  test('detects a plain object with ~standard property as a standard schema', () => {
    const schema = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: (value: unknown) => ({ value }),
      },
    };

    expect(isStandardSchema(schema)).toBe(true);
  });

  test('detects a callable object with ~standard property as a standard schema (like arktype)', () => {
    // Arktype schemas are functions that also have the ~standard property
    const callableSchema = Object.assign(
      function (value: unknown) {
        return value;
      },
      {
        '~standard': {
          version: 1,
          vendor: 'arktype',
          validate: (value: unknown) => ({ value }),
        },
      },
    );

    expect(isStandardSchema(callableSchema)).toBe(true);
  });

  test('returns false for a plain function without ~standard', () => {
    const fn = (value: unknown) => value;
    expect(isStandardSchema(fn)).toBe(false);
  });

  test('returns false for primitive values', () => {
    expect(isStandardSchema(null)).toBe(false);
    expect(isStandardSchema(undefined)).toBe(false);
    expect(isStandardSchema('')).toBe(false);
    expect(isStandardSchema('required')).toBe(false);
    expect(isStandardSchema(0)).toBe(false);
    expect(isStandardSchema(true)).toBe(false);
  });

  test('returns false for arrays', () => {
    expect(isStandardSchema([])).toBe(false);
    expect(isStandardSchema([() => true])).toBe(false);
  });

  test('returns false for plain objects without ~standard', () => {
    expect(isStandardSchema({})).toBe(false);
    expect(isStandardSchema({ required: true })).toBe(false);
  });
});
