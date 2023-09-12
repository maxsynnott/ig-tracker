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
	userController: asClass(UserController, {
		lifetime: Lifetime.SINGLETON,
	}),

	sessionService: asClass(SessionService, {
		lifetime: Lifetime.SINGLETON,
	}),

	authRoutes: asFunction(authRoutesFactory, {
		lifetime: Lifetime.SINGLETON,
	}),
	userRoutes: asFunction(userRoutesFactory, {
		lifetime: Lifetime.SINGLETON,
	}),
};

export const registerDiContainerDependencies = () => {
	diContainer.register(dependencies);
};
