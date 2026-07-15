const ENCRYPTION_SIGN_MESSAGE = 'Fluxkmail E2E Encryption Key Derivation v1';

export function getEncryptionSignMessage() {
  return ENCRYPTION_SIGN_MESSAGE;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function deriveStorageKey(signature) {
  const encoder = new TextEncoder();
  const data = encoder.encode(signature);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return crypto.subtle.importKey('raw', hashBuffer, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function generateKeyPair() {
  return crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );
}

export async function exportKeyPair(keyPair, signature) {
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

  const storageKey = await deriveStorageKey(signature);
  const encoder = new TextEncoder();
  const privateKeyBytes = encoder.encode(JSON.stringify(privateKeyJwk));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedPrivateKey = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    storageKey,
    privateKeyBytes
  );

  return {
    publicKey: JSON.stringify(publicKeyJwk),
    encryptedPrivateKey: arrayBufferToBase64(encryptedPrivateKey),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

export async function importPrivateKey(encryptedPrivateKeyB64, ivB64, signature) {
  const storageKey = await deriveStorageKey(signature);
  const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
  const encryptedPrivateKey = base64ToArrayBuffer(encryptedPrivateKeyB64);

  const decryptedBytes = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    storageKey,
    encryptedPrivateKey
  );

  const decoder = new TextDecoder();
  const privateKeyJwk = JSON.parse(decoder.decode(decryptedBytes));

  return crypto.subtle.importKey('jwk', privateKeyJwk, { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits']);
}

export async function importPublicKey(publicKeyStr) {
  const publicKeyJwk = JSON.parse(publicKeyStr);
  return crypto.subtle.importKey('jwk', publicKeyJwk, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
}

export async function encryptMessage(message, senderPrivateKey, recipientPublicKey) {
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: recipientPublicKey },
    senderPrivateKey,
    256
  );

  const aesKey = await crypto.subtle.importKey('raw', sharedSecret, { name: 'AES-GCM' }, false, ['encrypt']);

  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(message)
  );

  return {
    ciphertext: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

export async function decryptMessage(encryptedData, readerPrivateKey, otherPublicKeyStr) {
  const otherPublicKey = await importPublicKey(otherPublicKeyStr);

  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: otherPublicKey },
    readerPrivateKey,
    256
  );

  const aesKey = await crypto.subtle.importKey('raw', sharedSecret, { name: 'AES-GCM' }, false, ['decrypt']);

  const iv = new Uint8Array(base64ToArrayBuffer(encryptedData.iv));
  const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
  const decryptedBytes = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBytes);
}