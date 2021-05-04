import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
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
