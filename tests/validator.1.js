import Validator from './../src/validator';

// some tests are required to be run serially.
// since jest does not have test.serial yet
// creating seperate files seems to work.

test('uses the locale date format if none are specified', async () => {
  const v = new Validator({
    birthday: 'after:01/12/2008'
  });
  v.dictionary.setDateFormat('en', 'MM/DD/YYYY');
  expect(await v.validate('birthday', '01/13/2008')).toBe(true);
  expect(await v.validate('birthday', '13/01/2008')).toBe(false);

  // can also skip adding date_format params
  v.attach('field', 'date_format');
  expect(await v.validate('birthday', '01/13/2008')).toBe(true);
  expect(await v.validate('birthday', '13/01/2008')).toBe(false);
});