import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/domain/user/user.entity';
import { IUserRepository } from 'src/core/ports/out/user.repository.port';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepo: Repository<UserOrmEntity>,
  ) {}

  async findByGithubId(githubId: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { githubId } });
    return entity ? entity.toDomain() : null;
  }

  async create(user: User): Promise<User> {
    const userOrmEntity = UserOrmEntity.fromDomain(user);

    const savedUser = await this.ormRepo.save(userOrmEntity);

    if (!savedUser) {
      throw new InternalServerErrorException('User not saved in DB');
    }

    return savedUser.toDomain();
  }
}
