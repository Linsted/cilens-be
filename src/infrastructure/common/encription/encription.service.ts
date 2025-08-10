/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EncryptedPackage,
  IEncryptionPort,
  EncryptionAlgorithms,
} from 'src/core/ports/out/encryption.port';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/common/types/environment-variables';

@Injectable()
export class EncryptionService implements IEncryptionPort {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  KDF_PARAMS = { dkLen: 32 } as const;

  private async deriveKey(salt: Buffer): Promise<Buffer> {
    const encryptionPassword = this.configService.get<string>(
      'ENCRYPTION_PASSWORD',
    );
    if (!encryptionPassword) {
      throw new Error(
        'ENCRYPTION_PASSWORD is not defined in the configuration.',
      );
    }

    const { dkLen } = this.KDF_PARAMS;
    const scryptAsync = promisify(scrypt);

    return scryptAsync(encryptionPassword, salt, dkLen) as Promise<Buffer>;
  }

  private toB64(buf: Buffer) {
    return buf.toString('base64');
  }
  private fromB64(s: string) {
    return Buffer.from(s, 'base64');
  }

  async encrypt(text: string): Promise<EncryptedPackage> {
    try {
      const salt = randomBytes(16);
      const key = await this.deriveKey(salt);
      const iv = randomBytes(12);
      const cipher = createCipheriv(EncryptionAlgorithms.AES, key, iv);

      const data = Buffer.isBuffer(text) ? text : Buffer.from(text, 'utf8');
      const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
      const authTag = cipher.getAuthTag();

      return {
        version: 1,
        alg: EncryptionAlgorithms.AES,
        kdf: 'scrypt',
        kdfParams: { ...this.KDF_PARAMS },
        saltB64: this.toB64(salt),
        ivB64: this.toB64(iv),
        ciphertextB64: this.toB64(ciphertext),
        authTagB64: this.toB64(authTag),
      };
    } catch (error: any) {
      throw new BadRequestException('Encryption failed: ' + error?.message);
    }
  }

  async decrypt(pkg: EncryptedPackage): Promise<string> {
    try {
      if (pkg.alg !== EncryptionAlgorithms.AES || pkg.kdf !== 'scrypt')
        throw new BadRequestException('Unsupported format');

      const salt = this.fromB64(pkg.saltB64);
      const iv = this.fromB64(pkg.ivB64);
      const ciphertext = this.fromB64(pkg.ciphertextB64);
      const authTag = this.fromB64(pkg.authTagB64);

      const key = await this.deriveKey(salt);
      const decipher = createDecipheriv(EncryptionAlgorithms.AES, key, iv);

      decipher.setAuthTag(authTag);

      const plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);
      return plaintext.toString('utf-8');
    } catch (error) {
      throw new BadRequestException('Decryption failed: ' + error?.message);
    }
  }
}
