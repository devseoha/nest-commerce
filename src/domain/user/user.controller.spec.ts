import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../libs/auth/local.strategy';
import { JwtStrategy } from '../../libs/auth/jwt.strategy';
import { ormConfig } from '../../../ormconfig';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        TypeOrmModule.forRoot(ormConfig),
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
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
