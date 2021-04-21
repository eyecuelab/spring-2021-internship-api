import 'reflect-metadata';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';
import ormconfigJSON from '../ormconfig.json';
import { Tedis } from 'tedis';
import logger from '../src/shared/Logger';

let connection: Connection | null = null;

export async function initializeDB(): Promise<Connection> {
  if (connection) {
    logger.info('existing connection returned');
    return connection;
  }
  const envOpts = await getConnectionOptions();
  connection = await createConnection({ ...envOpts, ...ormconfigJSON });
  logger.info('Database successfully initialized');
  return connection;
}

export function initializeCache(port: number | undefined): unknown {
  const tedis = new Tedis({
    port: port,
    host: '127.0.0.1',
  });
  logger.info('Redis cache successfully initialized');
  return tedis;
}
