import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  entities: [__dirname + '/src/entities/*.ts'],
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_MASTER_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
