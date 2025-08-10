import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

import { User as DomainUser } from 'src/core/domain/user/user.entity';
import { EncryptedPackage } from 'src/core/ports/out/encryption.port';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  githubId: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column('jsonb')
  accessTokenEncrypted: EncryptedPackage;

  toDomain(): DomainUser {
    return new DomainUser(
      this.id,
      this.githubId,
      this.username,
      this.accessTokenEncrypted,
    );
  }

  static fromDomain(user: DomainUser): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.githubId = user.githubId;
    entity.username = user.username;
    entity.accessTokenEncrypted = user.accessToken;

    return entity;
  }
}
