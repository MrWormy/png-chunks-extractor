/**
 * PNG structure validation functions
 * @module lib/png-struct
 * @see http://www.libpng.org/pub/png/spec/iso/index-object.html#11Critical-chunks
 */

// Could add more struct validation
const PNG_SIGN = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const IHDR_TYPE = 1229472850;
const IHDR_LENGTH = 13;
const IEND_TYPE = 1229278788;
const IEND_LENGTH = 0;

/**
 * Validate IHDR chunk struct
 * @static
 * @param {Chunk} chunk - The chunk to validate
 * @return {null|string} - Error message or null
 */
export function validateIHDR(chunk) {
    if (chunk.type !== IHDR_TYPE) return "Invalid IHDR chunk type";
    if (chunk.dataBuf.length !== IHDR_LENGTH) return "Invalid IHDR chunk size";
    return null;
}
/**
 * Validate IEND chunk struct
 * @static
 * @param {Chunk} chunk - The chunk to validate
 * @return {null|string} - Error message or null
 */
export function validateIEND(chunk) {
    if (chunk.type !== IEND_TYPE) return "Invalid IEND chunk type";
    if (chunk.dataBuf.length !== IEND_LENGTH) return "IEND chunk should be empty";
    return null;
}

/**
 * Validates that the buffer provided is a PNG stream
 * @static
 * @param {Buffer} buff - The PNG raw buffer
 * @return {string|null} - The error message or null
 */
export function validatePNGSignature(buff) {
    return (PNG_SIGN.compare(buff, 0, 8) !== 0) ? 'Incorrect PNG signature' : null;
}
