import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { UserController } from './controllers/UserController';
import { Lifetime, asClass, asValue } from 'awilix';
import { prismaClient } from './clients/prismaClient';

export const buildApp = (options?: FastifyServerOptions) => {
	const app = fastify(options);

	app.register(dbPlugin);
	app.register(fastifyAwilixPlugin);

	diContainer.register({
		dbClient: asValue(prismaClient),
		userController: asClass(UserController, {
			lifetime: Lifetime.SINGLETON,
		}),
	});

	const userController = diContainer.resolve('userController');

	app.get('/users', userController.index);

	return app;
};
