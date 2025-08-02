import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/core/domain/user/user.entity';
import { IAuthService } from 'src/core/ports/in/auth.service.port';
import {
  IUserRepository,
  USER_REPOSITORY_PORT,
} from 'src/core/ports/out/user.repository.port';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserFromGithub(
    githubId: string,
    username: string,
    accessToken: string,
  ): Promise<User> {
    let user = await this.userRepo.findByGithubId(githubId);
    if (!user) {
      const uuid = uuidv4();

      user = new User(uuid, githubId, username, accessToken);
      user = await this.userRepo.create(user);
    }
    return user;
  }

  generateJwt(user: User): string {
    return this.jwtService.sign({ sub: user.id, username: user.username });
  }
}
