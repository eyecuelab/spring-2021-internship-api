import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { Tedis } from 'tedis';
import ormconfig from './ormconfig';
import logger from './shared/Logger';

let connection: Connection | null = null;

export async function initializeDB(): Promise<Connection> {
  if (connection) {
    logger.info('existing connection returned');
    return connection;
  }
  connection = await createConnection(ormconfig);
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
