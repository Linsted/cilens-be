import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/core/domain/user/user.entity';
import { IAuthService } from 'src/core/ports/in/auth.service.port';
import {
  ENCRYPTION_PORT,
  IEncryptionPort,
} from 'src/core/ports/out/encryption.port';
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
    @Inject(ENCRYPTION_PORT)
    private readonly encryptionService: IEncryptionPort,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserFromGithub(
    githubId: string,
    username: string,
    githubAccessToken: string,
  ): Promise<User> {
    let user = await this.userRepo.findByGithubId(githubId);
    if (!user) {
      const uuid = uuidv4();

      const encryptedAccessToken =
        await this.encryptionService.encrypt(githubAccessToken);
      if (!encryptedAccessToken) {
        throw new InternalServerErrorException(
          'Failed to encrypt GitHub access token',
        );
      }

      user = new User(uuid, githubId, username, encryptedAccessToken);
      user = await this.userRepo.create(user);
    }
    return user;
  }

  generateJwt(user: User): string {
    return this.jwtService.sign({ sub: user.id, username: user.username });
  }
}
