import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../../entities/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { StringToDate } from '../../libs/transformer';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async checkUser(email: string, password: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'password', 'isAdmin'],
    });

    if (!user) {
      throw new NotFoundException('회원정보가 존재하지 않습니다.');
    }

    const result = await bcrypt.compare(password, user.password);
    delete user.password;

    if (result) {
      return user;
    } else {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
  }

  async join(
    data: CreateUserDto,
  ): Promise<{ id: number; accessToken: string }> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const email = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email: data.email })
      .getOne();

    if (email) {
      throw new BadRequestException('이미 사용중인 이메일 입니다.');
    }

    try {
      const user = new Users();
      user.email = data.email;
      user.password = hashedPassword;
      user.birth = StringToDate(data.birth);

      const join = await this.userRepository.save(user);
      const accessToken = await this.getAccessToken(join);

      return { id: join.id, accessToken };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('회원가입 중 오류가 발생했습니다.');
    }
  }

  async getAccessToken(user: any) {
    const payload = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
  }
  async login(user: any) {
    const accessToken = await this.getAccessToken(user);

    return {
      id: user.id,
      accessToken,
    };
  }

  async validateUser(accessToken): Promise<Users> {
    let decodedJwt: object;
    try {
      decodedJwt = await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
    } catch (e) {
      throw new BadRequestException('유효하지 않은 토큰입니다.');
    }
    return decodedJwt as Users;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user: any = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId=:userId', { userId })
      .getOne();

    const result = await bcrypt.compare(refreshToken, user.refreshToken);
    if (result) {
      const { refreshToken, ...userWithoutRefreshToken } = user;

      return userWithoutRefreshToken;
    }
  }
}
