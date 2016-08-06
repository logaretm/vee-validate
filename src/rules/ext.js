export default (files, extensions) => {
    const regex = new RegExp(`\.(${extensions.join('|')})$`, 'i');
    for (let i = 0; i < files.length; i++) {
        if (! files[i].name.match(regex)) {
            return false;
        }
    }

    return true;
};
