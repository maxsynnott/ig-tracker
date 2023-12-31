import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { Cradle } from '@fastify/awilix';
import type IORedis from 'ioredis';
import { SessionService } from '../services/SessionService';
import { FastifyPluginCallback, preHandlerAsyncHookHandler } from 'fastify';
import { Resolver } from 'awilix';
import { LocationLogService } from '../services/LocationLogService';
import { LocationLogController } from '../controllers/LocationLogController';

declare module '@fastify/awilix' {
	interface Cradle {
		dbClient: PrismaClient;
		redisClient: IORedis;

		authController: AuthController;
		locationLogController: LocationLogController;
		userController: UserController;

		locationLogService: LocationLogService;
		sessionService: SessionService;

		authRoutes: FastifyPluginCallback;
		userRoutes: FastifyPluginCallback;
		locationLogRoutes: FastifyPluginCallback;

		sessionCookieAuthenticator: preHandlerAsyncHookHandler;
	}
}

export type DependencyFactory<T extends keyof Cradle> = (
	dependencies: Cradle,
) => Cradle[T];

export type DependencyResolvers = {
	[key in keyof Cradle]: Resolver<Cradle[key]>;
};
