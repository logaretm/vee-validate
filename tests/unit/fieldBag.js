import FieldBag from '@/core/fieldBag';
import Field from '@/core/field';

test('adds field items to the collection', () => {
  const bag = new FieldBag();
  const field = new Field({ el: null });

  bag.push(field);
  expect(bag).toHaveLength(1);

  // does not allow duplicates.
  expect(() => {
    bag.push(field);
  }).toThrowError(`[vee-validate] Field with id ${field.id} is already added.`);

  expect(() => {
    field.id = null;
    bag.push(field);
  }).toThrowError('[vee-validate] Field id must be defined.');

  // test type check.
  expect(() => {
    bag.push('generic');
  }).toThrowError('[vee-validate] FieldBag only accepts instances of Field');
});

test('finds the first field that matches a matcher object', () => {
  const bag = new FieldBag();
  const field1 = new Field({ name: 'email', scope: 's1' });
  const field2 = new Field({ name: 'email', scope: 's2' });
  const field3 = new Field({ name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  expect(bag.find({ id: field1.id })).toBe(field1);
  expect(bag.find({ name: 'email' })).toBe(field1);
  expect(bag.find({ name: 'email', scope: 's2' })).toBe(field2);
  expect(bag.find({ name: 'email', scope: null })).toBe(field3);

  // empty matcher gets the first field.
  expect(bag.find({})).toBe(field1);
});

test('filters the fields based on a matcher object', () => {
  const bag = new FieldBag();
  const field1 = new Field({ name: 'email', scope: 's1' });
  const field2 = new Field({ name: 'email', scope: 's2' });
  const field3 = new Field({ name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  expect(bag.filter({ id: field1.id })).toEqual([field1]);
  expect(bag.filter({ name: 'email' })).toEqual([field1, field2, field3]);
  expect(bag.filter({ name: 'email', scope: 's2' })).toEqual([field2]);
  expect(bag.filter({ name: 'email', scope: null })).toEqual([field3]);

  // multiple matching.
  expect(bag.filter([
    { name: 'email', scope: 's2' },
    { name: 'email', scope: 's1' }
  ])).toEqual([field1, field2]);
});

test('proxies the map method to the underlying array', () => {
  const bag = new FieldBag();
  const field1 = new Field({ name: 'email', scope: 's1' });
  const field2 = new Field({ name: 'email', scope: 's2' });
  const field3 = new Field({ name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);
  expect(bag.map(f => f.scope)).toEqual(['s1', 's2', null]);
});

test('removes the first field that matches a matcher object', () => {
  const bag = new FieldBag();
  const field1 = new Field({ name: 'email', scope: 's1' });
  const field2 = new Field({ name: 'email', scope: 's2' });
  const field3 = new Field({ name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  expect(bag).toHaveLength(3);
  // returns removed item.
  expect(bag.remove({ id: field1.id })).toBe(field1);
  expect(bag).toHaveLength(2);
  bag.remove({ name: 'email' });
  expect(bag).toHaveLength(1);

  // no such field.
  expect(bag.remove({ name: 'email', scope: 's2' })).toBe(null);
  expect(bag).toHaveLength(1);

  // can remove fields directly.
  bag.remove(field3);
  expect(bag).toHaveLength(0);
});

test('field bag instance is iterable', () => {
  const bag = new FieldBag();
  const field1 = new Field({ name: 'email', scope: 's1' });
  const field2 = new Field({ name: 'email', scope: 's2' });
  const field3 = new Field({ name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  let idx = 0;
  for (const field of bag) {
    expect(field.name).toBe(bag.items[idx].name);
    idx++;
  }

  expect(idx).toBe(3);
});
