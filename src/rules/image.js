export default (files) => {
    for (let i = 0; i < files.length; i++) {
        if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }
    }

    return true;
};
