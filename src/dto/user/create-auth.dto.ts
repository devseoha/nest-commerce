import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'dev@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'password' })
  password: string;
}
