/**
 * @module lib/png-chunks-extractor
 * @requires module:lib/crc
 */

import {readFile} from 'node:fs/promises';

const PNG_SIGN = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function validatePNGSignature(buff) {
    return (PNG_SIGN.compare(buff, 0, 8) === 0) ? 'Incorrect PNG signature' : null;
}

function handleErr(logOnError, throwOnError, err) {
    if (err) {
        if (logOnError) console.log(err);
        if (throwOnError) throw new Error(err);
    }
}

/**
 * @typedef {Object} Chunk
 * @property {Buffer} chunkBuf - Chunk raw data
 * @property {number} type - uint 32, png chunk type
 * @global
 */

/**
 * Extract a chunk from a PNG buffer
 * @param {Buffer} buffer - Raw PNG Buffer
 * @param {number} offset - Current read offset
 * @param {boolean} [testCrc=false] - If truthy, crc of each chunk is validated
 * @returns {Object.<{offset: number, chunk: Chunk}>} Parsed chunk and new offset
 */
function extractNextChunk(buffer, offset, testCrc = false) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.readUInt32BE(offset);
    offset += 4;
    const chunkBuf = buffer.subarray(offset, offset += length);
    // test crc
    offset += 4;
    return {
        chunk: {
            chunkBuf,
            type
        },
        offset
    };
}

/**
 * Parse a PNG file and return its data chunks
 * @function default
 * @static
 * @param {PathLike|FileHandle} file - PNG file
 * @param {Object} [options] - Parsing options
 * @param {boolean} [options.validateStruct=false] - Whether the general PNG structure needs to be validated (file starts with PNG signature and chunk stream begins with an IHDR chunk and ends with an empty IEND chunk) or not
 * @param {boolean} [options.validateCrc=false] - If truthy, check crc signature of each chunk and ignore it if there is a mismatch, further mismatch behaviour depends on {@link options.throwOnError} and {@link options.logOnError}
 * @param {boolean} [options.throwOnError=false] - If truthy, throws error when validation fails
 * @param {boolean} [options.logOnError=true] - If truthy, logs if validation fails
 * @return {Promise.<{chunks: Array.<Chunk>, chunksByType: Array.<{type:number, chunks:Array.<Chunk>}> }>} The raw chunks array (by order of appearance) and an object of these chunks indexed by chunk type (as a 32 bit unsigned int)
 */
export default async function(file, options = {}) {
    const {
        validateStruct = false, validateCrc = false, throwOnError = false, logOnError = true
    } = options;
    const fileBuffer = await readFile(file);
    let errCb = ((validateStruct || validateCrc) && (throwOnError || logOnError)) ? handleErr.bind(null, logOnError, throwOnError) : null;
    if (errCb && validateStruct) errCb(validatePNGSignature(fileBuffer));

    const chunks = [];
    const chunksByType = {};
    let chunk, offset = 8;
    while (offset < fileBuffer.length) {
        ({chunk, offset} = extractNextChunk(fileBuffer, offset, validateCrc));
        chunks.push(chunk);
        if (chunksByType[chunk.type]) chunksByType[chunk.type].push(chunk);
        else chunksByType[chunk.type] = [chunk];
    }
    return {
        chunks,
        chunksByType
    }
}
