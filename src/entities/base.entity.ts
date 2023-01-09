import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export default class Base extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at',
  })
  deletedAt: Date;
}
