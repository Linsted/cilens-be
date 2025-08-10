import { User } from '../../domain/user/user.entity';

export interface IUserRepository {
  findByGithubId(githubId: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

export const USER_REPOSITORY_PORT = Symbol('IUserRepository');
