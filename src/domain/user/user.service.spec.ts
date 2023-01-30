import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  class MockUserRepository {}
  class MockBannerRepository {}
  class MockBannerTargetRepository {}
  class MockTargetRepository {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          signOptions: {
            expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
          },
        }),
      ],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('register', () => {
    it('회원가입 시 email체크', async () => {
      const data: CreateUserDto = {
        email: 'mooo4030',
        password: 'password1234',
        birth: '19901130',
      };

      try {
        await expect(service.join(data)).resolves.toThrowError();
      } catch (error) {
        expect(error.message).toBe('Invalid email');
      }
    });
    //
    //   it('비밀번호 총6자리 && 필수로 숫자1자리가 들어가야합니다.', async () => {
    //     const data: CreateUserDto = {
    //       email: 'mooo4030@naver.com',
    //       password: 'password',
    //       birth: '19901130',
    //     };
    //
    //     try {
    //       await service.join(data);
    //     } catch (error) {
    //       expect(error.message).toBe('Password must be at least 6 characters');
    //     }
    //   });
    //
    //   it('should successfully register a user', async () => {
    //     const data: CreateUserDto = {
    //       email: 'mooo4030@naver.com',
    //       password: 'password',
    //       birth: '19901130',
    //     };
    //
    //     const registeredUser = await service.join(data);
    //     expect(registeredUser.id).toBe('??');
    //   });
  });
});
