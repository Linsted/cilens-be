import { User } from '../../domain/user/user.entity';

export interface IAuthService {
  validateUserFromGithub(
    githubId: string,
    username: string,
    accessToken: string,
  ): Promise<User>;

  generateJwt(user: User): string;
}

export const AUTH_SERVICE_PORT = Symbol('IAuthService');
