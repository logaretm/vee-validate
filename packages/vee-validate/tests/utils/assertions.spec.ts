import { isEqual, deepCopy } from 'packages/vee-validate/src/utils';

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

  test('class instances with private properties do not throw in isEqual (#4977)', () => {
    class MyClass {
      #secret: string;
      public name: string;

      constructor(name: string, secret: string) {
        this.name = name;
        this.#secret = secret;
      }

      getSecret() {
        return this.#secret;
      }
    }

    const a = new MyClass('test', 'secret1');
    const b = new MyClass('test', 'secret2');

    // Same reference should be equal
    expect(isEqual(a, a)).toBe(true);
    // Different instances should not be equal (reference equality for class instances)
    expect(isEqual(a, b)).toBe(false);
  });

  test('class instances with private properties nested in plain objects (#4977)', () => {
    class DataObj {
      #value: number;

      constructor(value: number) {
        this.#value = value;
      }

      getValue() {
        return this.#value;
      }
    }

    const obj1 = { name: 'test', data: new DataObj(1) };
    const obj2 = { name: 'test', data: obj1.data };
    const obj3 = { name: 'test', data: new DataObj(1) };

    // Same nested reference should be equal
    expect(isEqual(obj1, obj2)).toBe(true);
    // Different class instance references should not be equal
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  test('deepCopy does not throw on class instances with private properties (#4977)', () => {
    class MyClass {
      #secret: string;
      public name: string;

      constructor(name: string, secret: string) {
        this.name = name;
        this.#secret = secret;
      }

      getSecret() {
        return this.#secret;
      }
    }

    const instance = new MyClass('test', 'secret');
    const values = { field1: 'hello', myObj: instance };

    // Should not throw
    const cloned = deepCopy(values);

    // The plain object should be cloned
    expect(cloned).not.toBe(values);
    expect(cloned.field1).toBe('hello');
    // The class instance should be returned by reference, not cloned
    expect(cloned.myObj).toBe(instance);
    expect(cloned.myObj.getSecret()).toBe('secret');
  });

  test('deepCopy handles class instances nested in arrays (#4977)', () => {
    class Item {
      #id: number;

      constructor(id: number) {
        this.#id = id;
      }

      getId() {
        return this.#id;
      }
    }

    const item1 = new Item(1);
    const item2 = new Item(2);
    const values = { items: [item1, item2] };

    const cloned = deepCopy(values);

    expect(cloned).not.toBe(values);
    expect(cloned.items).not.toBe(values.items);
    // Class instances should be the same references
    expect(cloned.items[0]).toBe(item1);
    expect(cloned.items[1]).toBe(item2);
    expect(cloned.items[0].getId()).toBe(1);
    expect(cloned.items[1].getId()).toBe(2);
  });

  test('deepCopy still clones plain objects and primitive values', () => {
    const values = {
      name: 'test',
      nested: { a: 1, b: 2 },
      arr: [1, 2, 3],
      date: new Date('2024-01-01'),
    };

    const cloned = deepCopy(values);

    expect(cloned).not.toBe(values);
    expect(cloned.name).toBe('test');
    expect(cloned.nested).not.toBe(values.nested);
    expect(cloned.nested).toEqual({ a: 1, b: 2 });
    expect(cloned.arr).not.toBe(values.arr);
    expect(cloned.arr).toEqual([1, 2, 3]);
  });
});
