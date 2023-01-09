import { Column, Entity } from 'typeorm';
import Base from '@/entities/base.entity';

@Entity('user', { schema: 'commerce' })
export class User extends Base {
  @Column({
    type: 'varchar',
    name: 'email',
    comment: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'profile',
    comment: '프로필',
    nullable: true,
  })
  profile: string;

  @Column({
    type: 'varchar',
    name: 'password',
    comment: 'password',
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
    comment: '리프래쉬 토큰',
    nullable: true,
    select: false,
  })
  refreshToken: string;
}
