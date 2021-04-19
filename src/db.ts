import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Tedis } from 'tedis';
import logger from '../src/shared/Logger';

export async function initializeDB(): Promise<void> {
  await createConnection();
  logger.info('Database successfully initialized');
}

export function initializeCache(port: number | undefined): unknown {
  const tedis = new Tedis({
    port: port,
    host: '127.0.0.1',
  });
  logger.info('Redis cache successfully initialized');
  return tedis;
}
