import { isEqual } from 'packages/vee-validate/src/utils';

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
