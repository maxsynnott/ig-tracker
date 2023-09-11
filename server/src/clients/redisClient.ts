import IORedis from 'ioredis';
import { DependencyFactory } from '../types/awilix';
import { config } from '../config/config';

export const redisClientFactory: DependencyFactory<'redisClient'> = (
	dependencies,
) => {
	return new IORedis({
		host: config.redis.host,
		port: config.redis.port,
	});
};
