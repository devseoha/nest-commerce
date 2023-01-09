import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from '@/dto/user/create-auth.dto';

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    private jwtService: JwtService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new NotFoundException('회원정보가 존재하지 않습니다.');
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
  }

  async join(data: CreateAuthDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const email = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email: data.email })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    if (email) {
      throw new BadRequestException('이미 사용중인 이메일 입니다.');
    }

    try {
      const user = new User();
      user.email = data.email;
      user.password = hashedPassword;

      const join = await this.userRepository.save(user);
      const accessToken = await this.getAccessToken(join);
      const refreshToken = await this.getRefreshToken(join);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

      await this.setRefreshToken(join.id, hashedRefreshToken);

      return { id: join.id, accessToken, refreshToken };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getAccessToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  async getRefreshToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  async setRefreshToken(id: number, refreshToken: string) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken })
      .where('id=:id', { id })
      .execute();
  }

  async removeRefreshToken(id: number) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken: null })
      .where('id=:id', { id })
      .execute();
  }

  async login(user: any) {
    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    await this.setRefreshToken(user.id, hashedRefreshToken);

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async logout(user: any): Promise<boolean> {
    await this.removeRefreshToken(user.id);
    return true;
  }

  async validateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'refreshToken'],
    });

    const result = await bcrypt.compare(refreshToken, user.refreshToken);
    if (result) {
      const { refreshToken, ...userWithoutRefreshToken } = user;
      console.log('userWithoutRefreshToken:', userWithoutRefreshToken);
      return userWithoutRefreshToken;
    }
  }
}
