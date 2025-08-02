import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  IAuthService,
  AUTH_SERVICE_PORT,
} from '../../core/ports/in/auth.service.port';
import { Inject } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: IAuthService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // Redirect handled by Passport
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException(
        'User not found after GitHub authentication',
      );
    }

    const token = this.authService.generateJwt(user);

    return { token };
  }
}
