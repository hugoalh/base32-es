/**
 * Variant type of the Base32.
 */
export type Base32Variant =
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
interface Base32Specification {
	alphabet: string;
	padding: boolean;
}
const specificationHex: Base32Specification = {
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	padding: true
};
const specificationStandard: Base32Specification = {
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	padding: true
};
const specifications: Readonly<Record<Base32Variant, Base32Specification>> = {
	crockford: {
		alphabet: "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
		padding: false
	},
	geohash: {
		alphabet: "0123456789BCDEFGHJKMNPQRSTUVWXYZ",
		padding: false
	},
	hex: specificationHex,
	hexadecimal: specificationHex,
	rfc3548: specificationStandard,
	"rfc4648-6": specificationStandard,
	"rfc4648-7": specificationHex,
	standard: specificationStandard,
	wordsafe: {
		alphabet: "23456789CFGHJMPQRVWXcfghjmpqrvwx",
		padding: false
	},
	z: {
		alphabet: "YBNDRFG8EJKMCPQXOT1UWISZA345H769",
		padding: false
	}
};
/**
 * Base32 basic options.
 */
export interface Base32BasicOptions {
	/**
	 * Which Base32 variant to use.
	 * @default {"standard"}
	 */
	variant?: Base32Variant;
}
/**
 * Base32 decode options.
 */
export interface Base32DecodeOptions extends Base32BasicOptions {
}
/**
 * Base32 encode options.
 */
export interface Base32EncodeOptions extends Base32BasicOptions {
	/**
	 * Whether allow to have padding (`=`).
	 * 
	 * When this property is not defined as type of boolean, padding will according to the specification of the defined {@linkcode variant}.
	 * @default {null}
	 */
	padding?: boolean | null;
}
/**
 * Base32 decoder.
 */
export class Base32Decoder {
	get [Symbol.toStringTag](): string {
		return "Base32Decoder";
	}
	#variant: Base32Variant;
	/**
	 * Initialize.
	 * @param {Base32DecodeOptions} [options={}] Base32 decode options.
	 */
	constructor(options: Base32DecodeOptions = {}) {
		const { variant = "standard" }: Base32DecodeOptions = options;
		if (typeof specifications[variant] === "undefined") {
			throw new RangeError(`\`${variant}\` is not a valid Base32 variant type! Only accept these values: ${Object.keys(specifications).sort().join(", ")}`);
		}
		this.#variant = variant;
	}
	/**
	 * Variant of the Base32 decoder.
	 * @returns {Base32Variant}
	 */
	get variant(): Base32Variant {
		return this.#variant;
	}
	/**
	 * Decode from Base32 to bytes.
	 * @param {string | Uint8Array} item Item that need to decode.
	 * @returns {Uint8Array} A decoded bytes.
	 */
	decodeToBytes(item: string | Uint8Array): Uint8Array {
		const { alphabet }: Base32Specification = specifications[this.#variant];
		const itemFmt: string = ((typeof item === "string") ? item : new TextDecoder().decode(item)).replaceAll("=", "");
		if (!itemFmt.split("").every((character: string): boolean => {
			return alphabet.includes(character);
		})) {
			throw new Error(`Encoded data does not exclusively consist of Base32 (${this.#variant}) characters!`);
		}
		let bin: string = "";
		const result: string[] = [];
		for (let index: number = 0; index < itemFmt.length; index += 1) {
			bin += alphabet.indexOf(itemFmt[index]).toString(2).padStart(5, "0");
			while (bin.length >= 8) {
				result.push(bin.slice(0, 8));
				bin = bin.slice(8);
			}
		}
		if (bin.length > 0 && bin.split("").some((character: string): boolean => {
			return (character !== "0");
		})) {
			throw new Error(`Encoded data does not exclusively consist of Base32 (${this.#variant}) characters!`);
		}
		return Uint8Array.from(result.map((value: string): number => {
			return Number.parseInt(value, 2);
		}));
	}
	/**
	 * Decode from Base32 to text.
	 * @param {string | Uint8Array} item Item that need to decode.
	 * @returns {string} A decoded text.
	 */
	decodeToText(item: string | Uint8Array): string {
		return new TextDecoder().decode(this.decodeToBytes(item));
	}
}
/**
 * Base32 encoder.
 */
export class Base32Encoder {
	get [Symbol.toStringTag](): string {
		return "Base32Encoder";
	}
	#padding: boolean;
	#variant: Base32Variant;
	/**
	 * Initialize.
	 * @param {Base32EncodeOptions} [options={}] Base32 encode options.
	 */
	constructor(options: Base32EncodeOptions = {}) {
		const {
			padding = null,
			variant = "standard"
		}: Base32EncodeOptions = options;
		const specification: Base32Specification | undefined = specifications[variant];
		if (typeof specification === "undefined") {
			throw new RangeError(`\`${variant}\` is not a valid Base32 variant type! Only accept these values: ${Object.keys(specifications).sort().join(", ")}`);
		}
		this.#padding = (padding === null) ? specification.padding : padding;
		this.#variant = variant;
	}
	/**
	 * Whether padding in the Base32 encoder.
	 * @returns {boolean}
	 */
	get padding(): boolean {
		return this.#padding;
	}
	/**
	 * Variant of the Base32 encoder.
	 * @returns {Base32Variant}
	 */
	get variant(): Base32Variant {
		return this.#variant;
	}
	/**
	 * Encode to Base32 bytes.
	 * @param {string | Uint8Array} item Item that need to encode.
	 * @returns {Uint8Array} A Base32 encoded bytes.
	 */
	encodeToBytes(item: string | Uint8Array): Uint8Array {
		return new TextEncoder().encode(this.encodeToText(item));
	}
	/**
	 * Encode to Base32 text.
	 * @param {string | Uint8Array} item Item that need to encode.
	 * @returns {string} A Base32 encoded text.
	 */
	encodeToText(item: string | Uint8Array): string {
		const { alphabet }: Base32Specification = specifications[this.#variant];
		const itemFmt: Uint8Array = (typeof item === "string") ? new TextEncoder().encode(item) : item;
		let bin: string = "";
		let result: string = "";
		for (const byte of itemFmt) {
			bin += byte.toString(2).padStart(8, "0");
			while (bin.length >= 5) {
				result += alphabet.charAt(Number.parseInt(bin.slice(0, 5), 2));
				bin = bin.slice(5);
			}
		}
		if (bin.length > 0) {
			result += alphabet.charAt(Number.parseInt(bin.padEnd(5, "0"), 2));
		}
		return (this.#padding ? result.padEnd(Math.ceil(result.length / 8) * 8, "=") : result);
	}
}
/**
 * Transform from Base32 encoded bytes stream to bytes stream.
 */
export class Base32DecoderStream extends TransformStream<Uint8Array, Uint8Array> {
	get [Symbol.toStringTag](): string {
		return "Base32DecoderStream";
	}
	#base32Decoder: Base32Decoder;
	#bin: number[] = [];
	/**
	 * Initialize.
	 * @param {Base32DecodeOptions} [options={}] Base32 decode options.
	 */
	constructor(options?: Base32DecodeOptions) {
		super({
			transform: (chunk: Uint8Array, controller: TransformStreamDefaultController<Uint8Array>): void => {
				this.#bin.push(...Array.from(chunk));
				if (this.#bin.length >= 8) {
					try {
						controller.enqueue(this.#base32Decoder.decodeToBytes(Uint8Array.from(this.#bin.splice(0, Math.floor(this.#bin.length / 8) * 8))));
					} catch (error) {
						controller.error(error);
					}
				}
			},
			flush: (controller: TransformStreamDefaultController<Uint8Array>): void => {
				try {
					controller.enqueue(this.#base32Decoder.decodeToBytes(Uint8Array.from(this.#bin.splice(0, this.#bin.length))));
				} catch (error) {
					controller.error(error);
				}
			}
		});
		this.#base32Decoder = new Base32Decoder(options);
	}
}
/**
 * Transform from bytes stream to Base32 encoded bytes stream.
 */
export class Base32EncoderStream extends TransformStream<Uint8Array, Uint8Array> {
	get [Symbol.toStringTag](): string {
		return "Base32EncoderStream";
	}
	#base32Encoder: Base32Encoder;
	#bin: number[] = [];
	/**
	 * Initialize.
	 * @param {Base32EncodeOptions} [options={}] Base32 encode options.
	 */
	constructor(options: Base32EncodeOptions = {}) {
		super({
			transform: (chunk: Uint8Array, controller: TransformStreamDefaultController<Uint8Array>): void => {
				this.#bin.push(...Array.from(chunk));
				if (this.#bin.length >= 5) {
					try {
						controller.enqueue(this.#base32Encoder.encodeToBytes(Uint8Array.from(this.#bin.splice(0, Math.floor(this.#bin.length / 5) * 5))));
					} catch (error) {
						controller.error(error);
					}
				}
			},
			flush: (controller: TransformStreamDefaultController<Uint8Array>): void => {
				try {
					controller.enqueue(this.#base32Encoder.encodeToBytes(Uint8Array.from(this.#bin.splice(0, this.#bin.length))));
				} catch (error) {
					controller.error(error);
				}
			}
		});
		this.#base32Encoder = new Base32Encoder(options);
	}
}
