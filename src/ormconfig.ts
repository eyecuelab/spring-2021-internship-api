import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV ?? 'development';
if (env !== 'production') {
  // eslint-disable-next-line
  const dotenv = require('dotenv');
  const envVars = dotenv.config({
    path: `./env/${env}.env`,
  });
  if (envVars.error) {
    throw envVars.error;
  }
}

const ext = env === 'production' ? 'js' : 'ts';

const DatabaseConnectionTestConfiguration: ConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT ?? '5000'),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  entities: [__dirname + `/entities/*.${ext}`],
  migrations: [__dirname + `/migration/*.${ext}`],
  cli: {
    entitiesDir: __dirname + `/entities`,
    migrationsDir: __dirname + `/migration`,
    subscribersDir: __dirname + `/subscriber`,
  },
};

export = DatabaseConnectionTestConfiguration;
