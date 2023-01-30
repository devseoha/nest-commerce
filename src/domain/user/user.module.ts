import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { LocalStrategy } from '../../libs/auth/local.strategy';
import { JwtStrategy } from '../../libs/auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
})
export class UserModule {}
