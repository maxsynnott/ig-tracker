import { diContainer } from '@fastify/awilix';
import { asFunction, Lifetime, asClass } from 'awilix';
import { dbClientFactory } from './clients/dbClient';
import { redisClientFactory } from './clients/redisClient';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { authRoutesFactory } from './routes/authRoutes';
import { userRoutesFactory } from './routes/userRoutes';
import { SessionService } from './services/SessionService';
import { DependencyResolvers } from './types/awilix';
import { sessionCookieAuthenticatorFactory } from './hooks/sessionCookieAuthenticator';
import { locationLogRoutesFactory } from './routes/locationLogRoutes';
import { LocationLogController } from './controllers/LocationLogController';
import { LocationLogService } from './services/LocationLogService';

const dependencies: DependencyResolvers = {
	dbClient: asFunction(dbClientFactory, {
		lifetime: Lifetime.SINGLETON,
		asyncDispose: async (prismaClient) => {
			await prismaClient.$disconnect();
		},
	}),
	redisClient: asFunction(redisClientFactory, {
		lifetime: Lifetime.SINGLETON,
		asyncDispose: async (redisClient) => {
			await redisClient.quit();
		},
	}),

	authController: asClass(AuthController, {
		lifetime: Lifetime.SINGLETON,
	}),
	locationLogController: asClass(LocationLogController, {
		lifetime: Lifetime.SINGLETON,
	}),
	userController: asClass(UserController, {
		lifetime: Lifetime.SINGLETON,
	}),

	locationLogService: asClass(LocationLogService, {
		lifetime: Lifetime.SINGLETON,
	}),
	sessionService: asClass(SessionService, {
		lifetime: Lifetime.SINGLETON,
	}),

	authRoutes: asFunction(authRoutesFactory, {
		lifetime: Lifetime.SINGLETON,
	}),
	locationLogRoutes: asFunction(locationLogRoutesFactory, {
		lifetime: Lifetime.SINGLETON,
	}),
	userRoutes: asFunction(userRoutesFactory, {
		lifetime: Lifetime.SINGLETON,
	}),

	sessionCookieAuthenticator: asFunction(sessionCookieAuthenticatorFactory, {
		lifetime: Lifetime.SINGLETON,
	}),
};

export const registerDiContainerDependencies = () => {
	diContainer.register(dependencies);
};
