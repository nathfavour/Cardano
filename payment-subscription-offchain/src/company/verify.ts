import nacl from 'tweetnacl';

export function verifyEd25519Signature(message: string, signatureHex: string, publicKeyHex: string): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signatureHex, 'hex');
    const publicKeyBytes = Buffer.from(publicKeyHex, 'hex');
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch {
    return false;
  }
}