import crc from '../lib/crc.js'
import {strictEqual} from 'node:assert/strict';
import {describe, it} from 'node:test';

const b = Buffer.from([0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x02, 0x30, 0x00, 0x00, 0x00, 0x78, 0x08, 0x06, 0x00, 0x00, 0x00]);

describe('CRC', () => {
    // CRC is CRC of Chunk type and Chunk Data
    it('should compute correct crc', () => {
        // bitwise operations are signed 32bit
        strictEqual(crc(b), ~(~0xec65c847));
    });
});
