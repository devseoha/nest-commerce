import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../domain/user/user.service';
import { Users } from '../../entities/users.entity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const accessToken = req.headers['authorization'].split('Bearer ')[1];
    const validateUser: Users = await this.userService.validateUser(
      accessToken,
    );
    return true;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const accessToken = req.headers['authorization'].split('Bearer ')[1];
    const validateUser: Users = await this.userService.validateUser(
      accessToken,
    );
    if (!validateUser.isAdmin) {
      throw new BadRequestException('관리자권한을 확인해주세요.');
    }
    return true;
  }
}
