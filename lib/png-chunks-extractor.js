/**
 * @module lib/png-chunks-extractor
 * @requires module:lib/crc
 * @requires module:lib/png-struct
 */

import {readFile} from 'node:fs/promises';
import {validatePNGSignature, validateIHDR, validateIEND} from './png-struct.js';
import crcValidation from './crc.js';

function handleValidation(errCb, validationError) {
    if (validationError) {
        if (errCb) errCb(validationError);
        return validationError;
    }
    return null;
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
 * @param {boolean} [parseCrc=false] - If truthy, crc of each chunk is parsed
 * @returns {Object.<{offset: number, crc: number, crcBuf: Buffer, chunk: Chunk}>} Parsed chunk, chunk's CRC and new offset
 */
function extractNextChunk(buffer, offset, parseCrc = false) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.readUInt32BE(offset);
    const crcBuf = (parseCrc) ? buffer.subarray(offset, offset + 4 + length) : null;
    offset += 4;
    const chunkBuf = buffer.subarray(offset, offset += length);
    const crc = (parseCrc) ? buffer.readInt32BE(offset) : 0;
    offset += 4;
    return {
        chunk: {
            chunkBuf,
            type
        },
        offset,
        crc,
        crcBuf
    };
}

/**
 * Parse a PNG file and return its data chunks
 * @function default
 * @static
 * @param {PathLike|FileHandle} file - PNG file
 * @param {Object} [options] - Parsing options
 * @param {boolean} [options.validateStruct=true] - If truthy, validate the general PNG structure (file starts with PNG signature and chunk stream begins with an IHDR chunk and ends with an empty IEND chunk). Return null when validation fails
 * @param {boolean} [options.validateCrc=false] - If truthy, check crc signature of each chunk and ignore it if there is a mismatch, further mismatch behaviour depends on {@link options.throwOnError} and {@link options.logOnError}
 * @param {boolean} [options.throwOnError=false] - If truthy, throws error when validation fails
 * @param {boolean} [options.logOnError=true] - If truthy, logs if validation fails
 * @return {Promise.<{chunks: Array.<Chunk>, chunksByType: Array.<{type:number, chunks:Array.<Chunk>}> }> | null} The raw chunks array (by order of appearance) and an object of these chunks indexed by chunk type (as a 32 bit unsigned int)
 */
export default async function(file, options = {}) {
    const {
        validateStruct = true, validateCrc = false, throwOnError = false, logOnError = true
    } = options;
    const fileBuffer = await readFile(file);
    const errCb = (throwOnError || logOnError) ? handleErr.bind(null, logOnError, throwOnError) : null;
    const validationWrapper = handleValidation.bind(null, errCb);

    // validate signature
    if (validateStruct && validationWrapper(validatePNGSignature(fileBuffer))) return null;

    const chunks = [];
    const chunksByType = {};
    let chunk, offset = 8, crc = 0, crcBuf;

    const recordNextChunk = () => {
        ({chunk, offset, crc, crcBuf} = extractNextChunk(fileBuffer, offset, validateCrc));
        if (validateCrc && validationWrapper(crcValidation(crcBuf, crc))) return;
        chunks.push(chunk);
        if (chunksByType[chunk.type]) chunksByType[chunk.type].push(chunk);
        else chunksByType[chunk.type] = [chunk];
    }

    // validate first chunk
    if (validateStruct) {
        recordNextChunk();
        if (validationWrapper(validateIHDR(chunks[0]))) return null;
    }

    while (offset < fileBuffer.length) {
        recordNextChunk();
    }

    // validate last chunk
    if (validateStruct && validationWrapper(validateIEND(chunks.at(-1)))) return null;

    return {
        chunks,
        chunksByType
    }
}
