import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { Injectable, Inject } from '@nestjs/common';
import {
  AUTH_SERVICE_PORT,
  IAuthService,
} from 'src/core/ports/in/auth.service.port';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: IAuthService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, username } = profile;
    return await this.authService.validateUserFromGithub(
      id as string,
      username as string,
      accessToken,
    );
  }
}
