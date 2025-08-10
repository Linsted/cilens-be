interface ScryptParams {
  dkLen: number;
}

export enum EncryptionAlgorithms {
  AES = 'aes-256-gcm',
}

export interface EncryptedPackage {
  version: number;
  alg: EncryptionAlgorithms;
  kdf: 'scrypt';
  kdfParams: ScryptParams;
  saltB64: string;
  ivB64: string;
  ciphertextB64: string;
  authTagB64: string;
  aadB64?: string;
}

export interface IEncryptionPort {
  encrypt(text: string): Promise<EncryptedPackage>;
  decrypt(encryptedText: EncryptedPackage): Promise<string>;
}

export const ENCRYPTION_PORT = Symbol('IEncryptionPort');
