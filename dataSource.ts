import { DataSource, DataSourceOptions } from 'typeorm';
import { UserOrmEntity } from 'src/infrastructure/db/orm/entities/user.orm-entity';

import { config } from 'dotenv';
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [UserOrmEntity],

  migrations: [__dirname + '/src/infrastructure/db/orm/migrations/*.ts'],

  logging: true,

  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
