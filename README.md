# Base32 (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/base32-es](https://img.shields.io/github/v/release/hugoalh/base32-es?label=hugoalh/base32-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/base32-es")](https://github.com/hugoalh/base32-es)
[![JSR: @hugoalh/base32](https://img.shields.io/jsr/v/@hugoalh/base32?label=@hugoalh/base32&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/base32")](https://jsr.io/@hugoalh/base32)
[![NPM: @hugoalh/base32](https://img.shields.io/npm/v/@hugoalh/base32?label=@hugoalh/base32&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/base32")](https://www.npmjs.com/package/@hugoalh/base32)

An ECMAScript module for Base32 encode and decode.

## 🌟 Features

- Support multiple variants alphabet and padding:
  - [RFC 4648 §6: Base32 encoding](https://datatracker.ietf.org/doc/html/rfc4648#section-6) (Standard)
  - [RFC 4648 §7: Base32 encoding with extended hex alphabet](https://datatracker.ietf.org/doc/html/rfc4648#section-6) (Base32Hex)
  - Douglas Crockford's Base32 encoding (Base32Crockford)
  - Geohash Base32 encoding (Base32Geohash)
  - Word-safe Base32 encoding (Base32WordSafe)
  - Zooko Wilcox-O'Hearn's Base32 encoding (z-base-32) (Base32Z)
- Support stream encode and decode.

## 🎯 Targets

| **Runtime \\ Source** | **GitHub Raw** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources

- GitHub Raw
  ```
  https://raw.githubusercontent.com/hugoalh/base32-es/{Tag}/mod.ts
  ```
- JSR
  ```
  jsr:@hugoalh/base32[@{Tag}]
  ```
- NPM
  ```
  npm:@hugoalh/base32[@{Tag}]
  ```

> [!NOTE]
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## ⤵️ Entrypoints

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |

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
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/base32)

## ✍️ Examples

- ```ts
  new Base32Encoder().encodeToText("foobar");
  //=> "MZXW6YTBOI======"
  ```
