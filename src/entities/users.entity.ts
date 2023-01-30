import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class Users extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'email',
    comment: '이메일',
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    comment: '비밀번호',
    select: false,
  })
  password: string;

  @Column({
    type: 'date',
    name: 'birth',
    comment: '생년월일',
  })
  birth: Date;

  @Column({
    type: 'bool',
    name: 'is_admin',
    comment: '관리자 여부',
  })
  isAdmin: boolean;
}
