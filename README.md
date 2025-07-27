# Base32 (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/base32-es](https://img.shields.io/github/v/release/hugoalh/base32-es?label=hugoalh/base32-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/base32-es")](https://github.com/hugoalh/base32-es)
[![JSR: @hugoalh/base32](https://img.shields.io/jsr/v/@hugoalh/base32?label=@hugoalh/base32&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/base32")](https://jsr.io/@hugoalh/base32)
[![NPM: @hugoalh/base32](https://img.shields.io/npm/v/@hugoalh/base32?label=@hugoalh/base32&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/base32")](https://www.npmjs.com/package/@hugoalh/base32)

An ECMAScript (JavaScript & TypeScript) module for Base32 encode and decode.

## 🌟 Features

- Support multiple variants alphabet and padding:
  - [RFC 4648 §6: Base32 encoding](https://datatracker.ietf.org/doc/html/rfc4648#section-6) (Standard)
  - [RFC 4648 §7: Base32 encoding with extended hex alphabet](https://datatracker.ietf.org/doc/html/rfc4648#section-6) (Base32Hex)
  - Crockford's Base32 encoding (Douglas Crockford's Base32 encoding)
  - Geohash Base32 encoding
  - Word-safe Base32 encoding
  - z-base-32 (Zooko Wilcox-O'Hearn's Base32 encoding)
- Support stream encode and decode.

## 🔰 Begin

### 🎯 Targets

| **Targets** | **Remote** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

> [!NOTE]
> - It is possible to use this module in other methods/ways which not listed in here, however those methods/ways are not officially supported, and should beware maybe cause security issues.

### #️⃣ Resources Identifier

- **Remote - GitHub Raw:**
  ```
  https://raw.githubusercontent.com/hugoalh/base32-es/{Tag}/mod.ts
  ```
- **JSR:**
  ```
  [jsr:]@hugoalh/base32[@{Tag}]
  ```
- **NPM:**
  ```
  [npm:]@hugoalh/base32[@{Tag}]
  ```

> [!NOTE]
> - For usage of remote resources, it is recommended to import the entire module with the main path `mod.ts`, however it is also able to import part of the module with sub path if available, but do not import if:
>
>   - it's path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
>   - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
>   - it's symbol has an underscore prefix (e.g.: `_bar`, `_foo`).
>
>   These elements are not considered part of the public API, thus no stability is guaranteed for them.
> - For usage of JSR or NPM resources, it is recommended to import the entire module with the main entrypoint, however it is also able to import part of the module with sub entrypoint if available, please visit the [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub entrypoints.
> - It is recommended to use this module with tag for immutability.

### 🛡️ Runtime Permissions

*This module does not request any runtime permission.*

## 🧩 APIs

- ```ts
  class Base32Decoder {
    constructor(options?: Base32DecodeOptions);
    get variant(): Base32Variant;
    decodeToBytes(item: string | Uint8Array): Uint8Array;
    decodeToText(item: string | Uint8Array): string;
  }
  ```
- ```ts
  class Base32Encoder {
    constructor(options?: Base32EncodeOptions);
    get padding(): boolean;
    get variant(): Base32Variant;
    encodeToBytes(item: string | Uint8Array): Uint8Array;
    encodeToText(item: string | Uint8Array): string;
  }
  ```
- ```ts
  class Base32DecoderStream extends TransformStream<Uint8Array, Uint8Array> {
    constructor(options?: Base32DecodeOptions);
  }
  ```
- ```ts
  class Base32EncoderStream extends TransformStream<Uint8Array, Uint8Array> {
    constructor(options?: Base32EncodeOptions);
  }
  ```
- ```ts
  type Base32Variant =
    | "crockford"
    | "geohash"
    | "hex"
    | "hexadecimal"
    | "rfc3548"
    | "rfc4648-6"
    | "rfc4648-7"
    | "standard"
    | "wordsafe"
    | "z";
  ```
- ```ts
  interface Base32BasicOptions {
    variant?: Base32Variant;
  }
  ```
- ```ts
  interface Base32DecodeOptions extends Base32BasicOptions {
  }
  ```
- ```ts
  interface Base32EncodeOptions extends Base32BasicOptions {
    padding?: boolean | null;
  }
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/documentation_generator/)
>   - [JSR](https://jsr.io/@hugoalh/base32)

## ✍️ Examples

- ```ts
  new Base32Encoder().encodeToText("foobar");
  //=> "MZXW6YTBOI======"
  ```
