import { deepStrictEqual } from "node:assert";
import {
	Base32Decoder,
	Base32DecoderStream,
	Base32Encoder,
	Base32EncoderStream,
	type Base32Variant
} from "./mod.ts";
async function testerDirect(t: Deno.TestContext, decoded: string | Uint8Array, expects: Partial<Record<Base32Variant, string>>): Promise<void> {
	for (const [variant, encoded] of Object.entries(expects)) {
		await t.step(`${variant} Encode`, () => {
			deepStrictEqual(new Base32Encoder({
				variant: variant as Base32Variant
			}).encodeToText(decoded), encoded);
		});
		await t.step(`${variant} Decode`, () => {
			deepStrictEqual(new Base32Decoder({ variant: variant as Base32Variant }).decodeToText(encoded), (typeof decoded === "string") ? decoded : new TextDecoder().decode(decoded));
		});
	}
}
Deno.test("Direct 1", { permissions: "none" }, async (t) => {
	await testerDirect(t, "", {
		crockford: "",
		hex: "",
		standard: ""
	});
});
Deno.test("Direct 2", { permissions: "none" }, async (t) => {
	await testerDirect(t, "f", {
		standard: "MY======"
	});
});
Deno.test("Direct 3", { permissions: "none" }, async (t) => {
	await testerDirect(t, "fo", {
		standard: "MZXQ===="
	});
});
Deno.test("Direct 4", { permissions: "none" }, async (t) => {
	await testerDirect(t, "foo", {
		standard: "MZXW6==="
	});
});
Deno.test("Direct 5", { permissions: "none" }, async (t) => {
	await testerDirect(t, "foob", {
		standard: "MZXW6YQ="
	});
});
Deno.test("Direct 6", { permissions: "none" }, async (t) => {
	await testerDirect(t, "fooba", {
		standard: "MZXW6YTB"
	});
});
Deno.test("Direct 7", { permissions: "none" }, async (t) => {
	await testerDirect(t, "foobar", {
		standard: "MZXW6YTBOI======"
	});
});
Deno.test("Direct 8", { permissions: "none" }, async (t) => {
	await testerDirect(t, "A", {
		standard: "IE======",
		hex: "84======",
		crockford: "84"
	});
});
Deno.test("Direct 9", { permissions: "none" }, async (t) => {
	await testerDirect(t, "AA", {
		standard: "IFAQ====",
		hex: "850G====",
		crockford: "850G"
	});
});
Deno.test("Direct 10", { permissions: "none" }, async (t) => {
	await testerDirect(t, "AAA", {
		standard: "IFAUC===",
		hex: "850K2===",
		crockford: "850M2"
	});
});
Deno.test("Direct 11", { permissions: "none" }, async (t) => {
	await testerDirect(t, "AAAA", {
		standard: "IFAUCQI=",
		hex: "850K2G8=",
		crockford: "850M2G8"
	});
});
Deno.test("Direct 12", { permissions: "none" }, async (t) => {
	await testerDirect(t, "AAAAA", {
		standard: "IFAUCQKB",
		hex: "850K2GA1",
		crockford: "850M2GA1"
	});
});
Deno.test("Direct 13", { permissions: "none" }, async (t) => {
	await testerDirect(t, "AAAAAA", {
		standard: "IFAUCQKBIE======",
		hex: "850K2GA184======",
		crockford: "850M2GA184"
	});
});
async function testerStream(t: Deno.TestContext, filePath: string): Promise<void> {
	const sampleText = await Deno.readTextFile(filePath);
	const encodedDirect = new Base32Encoder().encodeToText(sampleText);
	await using sampleFile = await Deno.open(filePath);
	const encodedStream = sampleFile.readable.pipeThrough(new Base32EncoderStream());
	const encodedStreamTee = encodedStream.tee();
	const encodedStreamVisual = (await Array.fromAsync(encodedStreamTee[0].pipeThrough(new TextDecoderStream()).values())).join("");
	await t.step("Encode", () => {
		deepStrictEqual(encodedDirect, encodedStreamVisual);
	});
	const decodedDirect = new Base32Decoder().decodeToText(encodedDirect);
	await t.step("Decode Direct", () => {
		deepStrictEqual(sampleText, decodedDirect);
	});
	const decodedStream = encodedStreamTee[1].pipeThrough(new Base32DecoderStream());
	const decodedStreamVisual = (await Array.fromAsync(decodedStream.pipeThrough(new TextDecoderStream()).values())).join("");
	await t.step("Decode Stream", () => {
		deepStrictEqual(sampleText, decodedStreamVisual);
	});
}
Deno.test("Stream 1", {
	permissions: {
		read: true
	}
}, async (t) => {
	await testerStream(t, "./LICENSE.md");
});
Deno.test("Stream 2", {
	permissions: {
		read: true
	}
}, async (t) => {
	await testerStream(t, "./README.md");
});
Deno.test("Stream 3", {
	permissions: {
		read: true
	}
}, async (t) => {
	await testerStream(t, "./deno.jsonc");
});
