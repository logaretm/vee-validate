import test from 'ava';
import validate from './../../src/rules/dimensions';
import helpers from './../helpers';

// eslint-disable-next-line
test('validates image dimensions', async t => {
    const params = [150, 100];
    // Prepares Calls to window and Image objects.
    helpers.dimensionsTest({ width: 150, height: 100 });

    let result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], params);
    t.true(result[0].valid);

    // mock a failing Image, even with the right dimensions.
    helpers.dimensionsTest({ width: 150, height: 100}, true);
    result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(result[0].valid);

    // not an image.
    result = await validate([helpers.file('file.pdf', 'application/pdf', 10)], params);
    t.false(result);

    // wrong dimensions.
    helpers.dimensionsTest({ width: 30, height: 20});
    result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(result[0].valid);
});
