# Basic PNG chunks extractor
[![NPM Version](https://badgen.net/npm/v/png-chunks-extractor)](https://npmjs.org/package/png-chunks-extractor)

## Installation 
png-chunks-extractor is a Node.js module. It is available as a npm package.
```shell
npm i png-chunks-extractor
```

## Example
The package supports both ESM import and CJS require.
```javascript
import chunksExtractor from 'png-chunks-extractor';

const {chunks, chunksByType} = await chunksExtractor('path/to/file');
```
`chunks` is an array of [PNG chunks data and type](http://www.libpng.org/pub/png/spec/iso/index-object.html#5Chunk-layout).
```
{
  dataBuf: <Buffer 00 00 03 00 00 00 03 00 08 02 00 00 00>,
  type: 1229472850 // 'IHDR' decimal value
}
```
## Documentation
### chunksExtractor(PNGFile[, options])
- `PNGFile` [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<FileHandle>](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#class-filehandle) The file to parse.
- `options` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `validateStruct` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Enables [PNG structure validation](http://www.libpng.org/pub/png/spec/iso/index-object.html#5PNG-file-signature). **Default**: `true`
  - `validateCrc` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Enables [Chunks CRC validation](http://www.libpng.org/pub/png/spec/iso/index-object.html#5CRC-algorithm). CRC validation impacts parsing time. **Default**: `false`
  - `throwOnError` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Throws an error whenever there is a validation error. **Default**: `false`
  - `logOnError` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Logs any validation error. **Default**: `true`
- Returns [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/null) If the general structure validation fails
  - `chunks` [\<Object\[\]>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An array of the [PNG chunks](http://www.libpng.org/pub/png/spec/iso/index-object.html#4Concepts.FormatChunks).
    - `type` \<uint 32> The latin1 decimal expression of the type
    - `dataBuf` [\<Buffer>](https://nodejs.org/dist/latest-v18.x/docs/api/buffer.html) Raw chunk data
  - `chunksByType` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object with PNG type keys and chunk objects values

Parses `PNGFile` and returns its chunks 

[Extended documentation](https://www.vhector.com/png-chunks-extractor/)
