import FieldBag from '../src/fieldBag';
import Field from '../src/field';

test('adds field items to the collection', () => {
  const bag = new FieldBag();
  const field = new Field(null);

  bag.push(field);
  expect(bag.length).toBe(1);

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
  const field1 = new Field(null, { name: 'email', scope: 's1' });
  const field2 = new Field(null, { name: 'email', scope: 's2' });
  const field3 = new Field(null, { name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  expect(bag.find({ id: field1.id })).toBe(field1);
  expect(bag.find({ name: 'email' })).toBe(field1);
  expect(bag.find({ name: 'email', scope: 's2' })).toBe(field2);
  expect(bag.find({ name: 'email', scope: null })).toBe(field3);
});

test('filters the fields based on a matcher object', () => {
  const bag = new FieldBag();
  const field1 = new Field(null, { name: 'email', scope: 's1' });
  const field2 = new Field(null, { name: 'email', scope: 's2' });
  const field3 = new Field(null, { name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  expect(bag.filter({ id: field1.id })).toEqual([field1]);
  expect(bag.filter({ name: 'email' })).toEqual([field1, field2, field3]);
  expect(bag.filter({ name: 'email', scope: 's2' })).toEqual([field2]);
  expect(bag.filter({ name: 'email', scope: null })).toEqual([field3]);
});

test('removes the first field that matches a matcher object', () => {
  const bag = new FieldBag();
  const field1 = new Field(null, { name: 'email', scope: 's1' });
  const field2 = new Field(null, { name: 'email', scope: 's2' });
  const field3 = new Field(null, { name: 'email' });
  bag.push(field1);
  bag.push(field2);
  bag.push(field3);

  expect(bag.length).toBe(3);
  bag.remove({ id: field1.id });
  expect(bag.length).toBe(2);
  bag.remove({ name: 'email' });
  expect(bag.length).toBe(1);

  // no such field.
  bag.remove({ name: 'email', scope: 's2' });
  expect(bag.length).toBe(1);

  bag.remove({ name: 'email', scope: null });
  expect(bag.length).toBe(0);
});