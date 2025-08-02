import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

import { User as DomainUser } from 'src/core/domain/user/user.entity';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  githubId: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 500 })
  accessToken: string;

  toDomain(): DomainUser {
    return new DomainUser(
      this.id,
      this.githubId,
      this.username,
      this.accessToken,
    );
  }

  static fromDomain(user: DomainUser): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.githubId = user.githubId;
    entity.username = user.username;
    entity.accessToken = user.accessToken;

    return entity;
  }
}
