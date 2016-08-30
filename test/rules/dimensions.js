import test from 'ava';
import validate from './../../src/rules/dimensions';
import mocks from './../helpers';

// eslint-disable-next-line
test('it validates image dimensions', async t => {
    const params = [150, 100];
    // Prepares Calls to window and Image objects.
    mocks.dimensionsTest({ width: 150, height: 100 });

    let result = await validate([mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.true(result[0].valid);

    // mock a failing Image, even with the right dimensions.
    mocks.dimensionsTest({ width: 150, height: 100}, true);
    result = await validate([mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(result[0].valid);

    // not an image.
    result = await validate([mocks.file('file.pdf', 'application/pdf', 10)], params);
    t.false(result);

    // wrong dimensions.
    mocks.dimensionsTest({ width: 30, height: 20});
    result = await validate([mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(result[0].valid);
});
