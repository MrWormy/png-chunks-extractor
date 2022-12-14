import {describe, it} from "node:test";
import {deepStrictEqual} from "node:assert/strict";

import pngChunksExtractor from "../lib/png-chunks-extractor.js";

await pngChunksExtractor(new URL('test.png', import.meta.url));
describe('PNG parsing', () => {
    it('should parse without error', async () => {
        const chunks = await pngChunksExtractor(new URL('test.png', import.meta.url));
        deepStrictEqual(Object.keys(chunks), ['chunks', 'chunksByType']);
    });
    it('should parse correctly', async () => {
        const chunks = await pngChunksExtractor(new URL('test.png', import.meta.url));
        console.log(chunks.chunks[0])
        const captions = Object.fromEntries(chunks.chunksByType[1950701684].map(({dataBuf}) => dataBuf.toString().split('\x00')));
        deepStrictEqual(captions, {
            prompt: "painting of a male elf in a forest, perfect light, high contrast, beautiful day",
            nprompt: "rain, text",
            gscale: "7.0",
            steps: "40",
            seed: "3120987359786117057",
            nsample: "1"
        });
    });
    it('should parse with options', async () => {
        const chunks = await pngChunksExtractor(new URL('test.png', import.meta.url), {
            validateCrc: true,
            validateStruct: true,
            throwOnError: true,
            logOnError: true
        });
        deepStrictEqual(Object.keys(chunks), ['chunks', 'chunksByType']);
    });
});
