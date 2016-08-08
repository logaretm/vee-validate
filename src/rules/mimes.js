export default (files, mimes) => {
    const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
    for (let i = 0; i < files.length; i++) {
        if (! regex.test(files[i].type)) {
            return false;
        }
    }

    return true;
};
