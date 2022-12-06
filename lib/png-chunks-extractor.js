/**
 * @module lib/png-chunks-extractor
 */

import {readFile} from 'node:fs/promises';

const PNG_SIGN = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function isPNG(buff) {
    return PNG_SIGN.compare(buff, 0, 8) === 0;
}

/**
 * @typedef {Object} Chunk
 * @property {Buffer} chunkBuf - Chunk raw data
 * @property {number} type - uint 32, png chunk type
 */

/**
 * Extract a chunk from a PNG buffer
 * @param {Buffer} buffer - Raw PNG Buffer
 * @param {number} offset - Current read offset
 * @param {boolean} [testCrc=false] - If truthy, crc of each chunk is validated
 * @returns {{offset: number, chunk: Chunk}} Parsed chunk and new offset
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
 * @param {PathLike|FileHandle} file - PNG file
 * @param {Object} [options] - Parsing options
 * @param {boolean} [options.validateStruct=false] - Whether the general PNG structure needs to be validated (chunks begin with an IHDR chunk and end with an empty IEND chunk) or not (PNG signature is not affected by this option and will always be validated)
 * @param {boolean} [options.validateCrc=false] - If truthy, check crc signature of each chunk and ignore it if there is a mismatch, further mismatch behaviour depends on {@link options.exitOnError} and {@link options.logOnError}
 * @param {boolean} [options.exitOnError=false] - If truthy, throw error and exit when validation fails
 * @param {boolean} [options.logOnError=true] - If truthy, log if validation fails
 * @return {Promise.<{chunks: Array.<Chunk>, chunksByType: Array.<{type:number, chunks:Array.<Chunk>}> }>} The raw chunks array (by order of appearance) and an object of these chunks indexed by chunk type (as a 32 bit unsigned int)
 */
export default async function(file, options = {}) {
    const {
        validateStruct = false, validateCrc = false, exitOnError = false, logOnError = true
    } = options;
    const fileBuffer = await readFile(file);
    if (!isPNG(fileBuffer)) throw new Error('Invalid: File is not a PNG');

    const chunks = [];
    const chunksByType = {};
    let chunk, offset = 8;
    while (offset < fileBuffer.length) {
        ({chunk, offset} = extractNextChunk(fileBuffer, offset, options.validateCrc));
        chunks.push(chunk);
        if (chunksByType[chunk.type]) chunksByType[chunk.type].push(chunk);
        else chunksByType[chunk.type] = [chunk];
    }
    return {
        chunks,
        chunksByType
    }
}
