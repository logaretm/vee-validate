import validate from './../../src/rules/dimensions';
import helpers from './../helpers';

// eslint-disable-next-line
it('validates image dimensions', async () => {
    const params = [150, 100];
    // Prepares Calls to window and Image objects.
    helpers.dimensionsTest({ width: 150, height: 100 });

    let result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], params);
    expect(result[0].valid).toBe(true);

    // mock a failing Image, even with the right dimensions.
    helpers.dimensionsTest({ width: 150, height: 100}, true);
    result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], params);
    expect(result[0].valid).toBe(false);

    // not an image.
    result = await validate([helpers.file('file.pdf', 'application/pdf', 10)], params);
    expect(result).toBe(false);

    // wrong dimensions.
    helpers.dimensionsTest({ width: 30, height: 20});
    result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], params);
    expect(result[0].valid).toBe(false);
});
