import { EncryptedPackage } from '../../ports/out/encryption.port';

export class User {
  constructor(
    public id: string,
    public githubId: string,
    public username: string,
    public accessToken: EncryptedPackage,
  ) {}
}
