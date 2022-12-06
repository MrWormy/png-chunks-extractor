import {readFile} from 'node:fs/promises';

const PNG_SIGN = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function isPNG(buff) {
    return PNG_SIGN.compare(buff, 0, 8) === 0;
}

function extractNextChunk(buffer, offset, testCrc = false) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.readUInt32BE(offset);
    offset += 4;
    const chunk = buffer.subarray(offset, offset += length);
    // test crc
    offset += 4;
    return {
        type,
        chunk,
        offset
    };
}

/**
 * Parse a PNG file and return its data chunks
 * @module
 * @function
 * @param {PathLike|FileHandle} file - PNG file
 * @param {Object} [options] - Parsing options
 * @param {boolean} [options.validateStruct=false] - Whether the general PNG structure needs to be validated (chunks begin with an IHDR chunk and end with an empty IEND chunk) or not (PNG signature is not affected by this option and will always be validated)
 * @param {boolean} [options.validateCrc=false] - If truthy, check crc signature of each chunk and ignore it if there is a mismatch, further mismatch behaviour depends on {@link options.exitOnError} and {@link options.logOnError}
 * @param {boolean} [options.exitOnError=false] - If truthy, throw error and exit when validation fails
 * @param {boolean} [options.logOnError=true] - If truthy, log if validation fails
 * @return {Promise.<{chunks: Array, chunksByType: Object}>} The raw chunks array (by order of appearance) and an object of these chunks indexed by chunk type (as a 32 bit unsigned int)
 * @exports module:lib/png-chunks-extractor
 */
export default async function PngChunksExtractor(file, options = {}) {
    const {
        validateStruct = false, validateCrc = false, exitOnError = false, logOnError = true
    } = options;
    const fileBuffer = await readFile(file);
    if (!isPNG(fileBuffer)) throw new Error('Invalid: File is not a PNG');

    const chunks = [];
    const chunksByType = {};
    let type, chunk, offset = 8;
    while (offset < fileBuffer.length) {
        ({type, chunk, offset} = extractNextChunk(fileBuffer, offset, options.validateCrc));
        chunks.push(chunk);
        if (chunksByType[type]) chunksByType[type].push(chunk);
        else chunksByType[type] = [chunk];
    }
    return {
        chunks,
        chunksByType
    }
}
