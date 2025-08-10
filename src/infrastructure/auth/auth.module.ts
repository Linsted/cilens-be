import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUTH_SERVICE_PORT } from 'src/core/ports/in/auth.service.port';
import { USER_REPOSITORY_PORT } from 'src/core/ports/out/user.repository.port';
import { AuthService } from '../../application/modules/auth/auth.service';
import { GithubStrategy } from '../../application/modules/auth/strategies/github.strategy';
import { UserOrmEntity } from '../db/orm/entities/user.orm-entity';
import { UserRepository } from '../db/orm/repositories/user.repository';
import { ENCRYPTION_PORT } from 'src/core/ports/out/encryption.port';
import { EncryptionService } from '../common/encription/encription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: AUTH_SERVICE_PORT,
      useClass: AuthService,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepository,
    },
    GithubStrategy,
    {
      provide: ENCRYPTION_PORT,
      useClass: EncryptionService,
    },
  ],
  exports: [AUTH_SERVICE_PORT, USER_REPOSITORY_PORT, ENCRYPTION_PORT],
})
export class AuthModule {}
