import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  entities: [__dirname + '/src/database/entities/*.ts'],
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: true,
  logging: true,
  keepConnectionAlive: true,
  replication: {
    master: {
      host: process.env.DB_MASTER_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    slaves: [
      {
        host: process.env.DB_MASTER_HOST,
        port: 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      },
    ],
  },
};
