/**
 * CRC util module
 * @module lib/crc
 */

// Pre computed values
const crc_table = [];

let c, n, k;

// Pre compute crc_table
for (n = 0; n < 256; n++) {
    c = n;
    for (k = 0; k < 8; k++) {
        if (c & 1) c = 0xedb88320 ^ (c >>> 1);
        else c >>>= 1;
    }
    crc_table[n] = c;
}

/**
 * Update crc with buf content
 * @param {number} crc - current crc
 * @param {Buffer} buf - data buffer
 * @return {number} - updated crc
 */
function updateCrc(crc, buf) {
    let c = crc;
    for (let n = 0, len = buf.length; n < len; n++) {
        c = crc_table[(c ^ buf[n]) & 0xff] ^ (c >>> 8);
    }
    return c;
}

/**
 * Return the CRC of the bytes buf[0..len-1].
 * @param {Buffer} buf - The buffer used to calculate thr CRC
 * @return {number} - sInt 32 the CRC value of buf
 */
function crc(buf)
{
    return updateCrc(0xffffffff, buf) ^ 0xffffffff;
}

/**
 * Validate CRC of buf
 * @function default
 * @static
 * @param {Buffer} buf - Chunk type + data buffer
 * @param crcVal - chunk CRC val
 * @return {null|string} - The error message or null
 */
export default function validateCrc(buf, crcVal) {
    if (crc(buf) !== crcVal) return "Invalid chunk CRC";
    return null;
}
