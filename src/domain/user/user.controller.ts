import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../libs/auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseDto } from '../../libs/response.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '이메일, 비밀번호를 입력하여 회원가입을 진행합니다. ',
  })
  @Post('/join')
  @ApiBody({ type: CreateUserDto })
  async join(@Body() data: CreateUserDto): Promise<ResponseDto> {
    const result = await this.userService.join(data);
    return {
      result: true,
      code: 200,
      data: {
        id: result?.id,
        accessToken: result?.accessToken,
        message: '가입 되었습니다.',
      },
    };
  }

  @ApiOperation({
    summary: '로그인',
    description:
      '회원가입 시 입력하였던 이메일과 패스워드를 이용하여 로그인합니다.',
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@test.com' },
        password: { type: 'string', example: '123456a' },
      },
    },
  })
  @Post('/login')
  @ApiBearerAuth()
  async login(@Req() req): Promise<ResponseDto> {
    const result = await this.userService.login(req.user);
    return {
      result: true,
      code: 200,
      data: {
        id: result.id,
        accessToken: result.accessToken,
        message: '로그인 되었습니다.',
      },
    };
  }
}
