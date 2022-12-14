const pce = import('./lib/png-chunks-extractor.js');

module.exports = async function (file, options = {}) {
    let def;
    ({default: def} = await pce);
    return await def(file, options);
};
