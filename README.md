# Basic PNG chunks parser
```shell
npm i -s png-chunks-parser
```

```javascript
import chunksParser from 'png-chunks-extractor';

const {chunks, chunksByType} = await chunksParser('path/to/file');
```
## chunksParser(PNGFile[, options])
- `PNGFile` [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<FileHandle>](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#class-filehandle) The file to parse.
- `options` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `validateStruct` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Enables [PNG structure validation](http://www.libpng.org/pub/png/spec/iso/index-object.html#5PNG-file-signature). **Default**: `false`
  - `validateCrc` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Enables [Chunks CRC validation](http://www.libpng.org/pub/png/spec/iso/index-object.html#5CRC-algorithm). **Default**: `false`
  - `exitOnError` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Exits whenever there is a validation error. **Default**: `false`
  - `logOnError` [\<boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Logs any validation error. **Default**: `true`
- Returns [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `chunks` [\<Object\[\]>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An array of the [PNG chunks](http://www.libpng.org/pub/png/spec/iso/index-object.html#4Concepts.FormatChunks).
    - `type` \<uint 32> The latin1 decimal expression of the type
    - `chunkBuf` [\<Buffer>](https://nodejs.org/dist/latest-v18.x/docs/api/buffer.html) Raw chunk data
  - `chunksByType` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object with PNG type keys and chunk objects values

Parses `PNGFile` and returns its chunks 

[Extended documentation](https://www.vhector.com/png-chunks-extractor/)
