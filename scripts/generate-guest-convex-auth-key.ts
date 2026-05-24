const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
	'sign',
	'verify'
]);

const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
const keyIdBytes = new Uint8Array(8);
crypto.getRandomValues(keyIdBytes);

let keyId = '';
for (const byte of keyIdBytes) {
	keyId += byte.toString(16).padStart(2, '0');
}

console.log(
	JSON.stringify({
		...privateJwk,
		kid: `guest-convex-auth-${keyId}`,
		alg: 'ES256',
		use: 'sig'
	})
);
