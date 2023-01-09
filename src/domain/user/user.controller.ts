import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../libs/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@/libs/auth/local-auth.guard';
import { JwtRefreshGuard } from '@/libs/auth/jwt-refresh.guard';
import { CreateAuthDto } from '@/dto/user/create-auth.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('/join')
  @ApiBody({ type: CreateAuthDto })
  async join(@Body() data: CreateAuthDto) {
    const result = await this.userService.join(data);

    return {
      result: true,
      code: 200,
      data: {
        id: result.id,
        accessToken: result.accessToken,
        refresh: result.refreshToken,
        message: '가입 되었습니다.',
      },
    };
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req) {
    const result = await this.userService.login(req.user);
    return {
      result: true,
      code: 200,
      data: {
        id: result.id,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req) {
    const result = await this.userService.logout(req.user);
    req.logout();
    return {
      result: true,
      code: 200,
      data: {
        message: '정상적으로 로그아웃 되었습니다.',
      },
    };
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(@Req() req) {
    return this.userService.login(req.user);
  }
}
