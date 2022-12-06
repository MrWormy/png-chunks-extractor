/**
 * CRC util module
 * @module lib/crc
 */

const crc_table = [];

/**
 * Make the table for a fast CRC.
 */
let c, n, k;

for (n = 0; n < 256; n++) {
    c = n;
    for (k = 0; k < 8; k++) {
        if (c & 1) c = 0xedb88320 ^ (c >>> 1);
        else c >>>= 1;
    }
    crc_table[n] = c;
}

function updateCrc(crc, buf) {
    let c = crc;
    for (let n = 0, len = buf.length; n < len; n++) {
        c = crc_table[(c ^ buf[n]) & 0xff] ^ (c >>> 8);
    }
    return c;
}

/**
 * Return the CRC of the bytes buf[0..len-1].
 * @function module:lib/crc
 */
export default function crc(buf)
{
    return updateCrc(0xffffffff, buf) ^ 0xffffffff;
}
