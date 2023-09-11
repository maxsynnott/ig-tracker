import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { Cradle } from '@fastify/awilix';
import type IORedis from 'ioredis';
import { SessionService } from '../services/SessionService';

declare module '@fastify/awilix' {
	interface Cradle {
		dbClient: PrismaClient;
		redisClient: IORedis;

		authController: AuthController;
		userController: UserController;

		sessionService: SessionService;
	}
}

export type DependencyFactory<T extends keyof Cradle> = (
	dependencies: Cradle,
) => Cradle[T];
