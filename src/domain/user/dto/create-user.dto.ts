import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomValidatePassword } from '../../../libs/class-validator/password';
import { CustomValidateDate } from '../../../libs/class-validator/date';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'dev@gmail.com',
    description: '메일주소를 입력해주세요.',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(CustomValidatePassword, {
    message:
      '비밀번호는 길이가 영문6자 이상에 숫자 1개를 반드시 포함해야 합니다.',
  })
  @ApiProperty({
    type: String,
    example: '123456a',
    description: '비밀번호를 입력해주세요.',
  })
  password: string;

  @IsString()
  @Validate(CustomValidateDate, {
    message: '생년월일을 8자리 숫자로 입력해주세요. ex)20230101',
  })
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '20230101',
    description: '생년월일을 입력해주세요.',
  })
  birth: string;
}
