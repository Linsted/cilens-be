import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { Injectable, Inject } from '@nestjs/common';
import {
  AUTH_SERVICE_PORT,
  IAuthService,
} from 'src/core/ports/in/auth.service.port';
import { User } from 'src/core/domain/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/common/types/environment-variables';
import { GithubProfile } from 'src/common/types/common-types';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: IAuthService,
    readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      clientID: configService.get('S_GITHUB_CLIENT_ID'),
      clientSecret: configService.get('S_GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('S_GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: GithubProfile,
  ): Promise<User> {
    const { id, username } = profile;
    return await this.authService.validateUserFromGithub(
      id,
      username,
      accessToken,
    );
  }
}
