import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async test(): Promise<any> {
    const result = await this.appService.test();
    return {
      code: 200,
      message: '통신완료',
      data: result,
    };
  }
}
