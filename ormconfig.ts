import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

// Set the env file
const env = process.env.NODE_ENV ?? 'development';
const envVars = dotenv.config({
  path: `./env/${env}.env`,
});
if (envVars.error) {
  throw envVars.error;
}

const DatabaseConnectionTestConfiguration: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  dropSchema: true,
  entities: [__dirname + '/src/entities/*.ts'],
  migrations: [__dirname + '/src/migration/*.ts'],
  cli: {
    entitiesDir: __dirname + '/src/entities',
    migrationsDir: __dirname + '/src/migration',
    subscribersDir: __dirname + '/src/subscriber',
  },
};

export = DatabaseConnectionTestConfiguration;
