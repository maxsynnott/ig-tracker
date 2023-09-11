import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { UserController } from './controllers/UserController';
import { Lifetime, asClass, asFunction } from 'awilix';
import { prismaClientDependencyFactory } from './clients/prismaClient';
import fastifyEnv from '@fastify/env';
import { JSONSchemaType } from 'env-schema';

type EnvVars = {
	DATABASE_URL: string;
	INSTAGRAM_APP_SECRET: string;
};
const envVarsSchema: JSONSchemaType<EnvVars> = {
	type: 'object',
	required: ['DATABASE_URL', 'INSTAGRAM_APP_SECRET'],
	properties: {
		DATABASE_URL: {
			type: 'string',
		},
		INSTAGRAM_APP_SECRET: {
			type: 'string',
		},
	},
	additionalProperties: false,
};

export const buildApp = async (options?: FastifyServerOptions) => {
	const app = fastify(options);

	await app.register(fastifyEnv, {
		dotenv: true,
		schema: envVarsSchema,
	});
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
