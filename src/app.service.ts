import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async test(): Promise<string> {
    return 'test';
  }
}
