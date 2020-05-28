function importAll(r) {
    return r.keys().map(r);
}

const gifImages = importAll(require.context('../../emojis/', false, /\.(gif)$/));

export default gifImages;