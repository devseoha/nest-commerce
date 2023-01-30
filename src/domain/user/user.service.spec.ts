import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../../../ormconfig';
import { Users } from '../../entities/users.entity';
import { UserController } from './user.controller';
import { LocalStrategy } from '../../libs/auth/local.strategy';
import { JwtStrategy } from '../../libs/auth/jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let jwtService: JwtService;

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
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const userData: CreateUserDto = {
        email: 'test@test.com',
        password: 'Password123!',
        birth: '19950101',
      };

      const expectedResult = { id: 1, accessToken: 'test-accesstoken' };
      jest.spyOn(userService, 'join').mockResolvedValue(expectedResult);
      const result = await userService.join(userData);

      expect(result).toEqual(expectedResult);
      expect(userService.join).toHaveBeenCalledWith(userData);
    });
  });
});
