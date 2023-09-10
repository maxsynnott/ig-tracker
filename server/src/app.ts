import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { UserController } from './controllers/UserController';
import { Lifetime, asClass, asValue, asFunction } from 'awilix';
import { prismaClientDependencyFactory } from './clients/prismaClient';

export const buildApp = (options?: FastifyServerOptions) => {
	const app = fastify(options);

	app.register(fastifyAwilixPlugin, {
		asyncDispose: true,
		disposeOnClose: true,
		disposeOnResponse: true,
	});
	diContainer.register({
		dbClient: asFunction(prismaClientDependencyFactory, {
			lifetime: Lifetime.SCOPED,
			asyncDispose: async (prismaClient) => {
				await prismaClient.$disconnect();
			},
		}),
		userController: asClass(UserController, {
			lifetime: Lifetime.SINGLETON,
		}),
	});

	app.register(dbPlugin);

	const userController = diContainer.resolve('userController');

	app.get('/users', userController.index);

	return app;
};
