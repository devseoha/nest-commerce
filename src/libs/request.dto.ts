import { Users } from '../entities/users.entity';

export interface RequestDto extends Request {
  user: Users;
}
