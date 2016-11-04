export default (files, extensions) => {
    const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');
    for (let i = 0; i < files.length; i++) {
        if (! regex.test(files[i].name)) {
            return false;
        }
    }

    return true;
};
