import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { UserController } from './controllers/UserController';
import { Lifetime, asClass, asFunction } from 'awilix';
import { prismaClientDependencyFactory } from './clients/prismaClient';
import fastifyEnv from '@fastify/env';
import { JSONSchemaType } from 'env-schema';
import { EnvVars } from './types/env';
import { AuthController } from './controllers/AuthController';

const envVarsSchema: JSONSchemaType<EnvVars> = {
	type: 'object',
	required: ['DATABASE_URL', 'FACEBOOK_CLIENT_ID', 'FACEBOOK_CLIENT_SECRET'],
	properties: {
		DATABASE_URL: {
			type: 'string',
		},
		FACEBOOK_CLIENT_ID: {
			type: 'string',
		},
		FACEBOOK_CLIENT_SECRET: {
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
		authController: asClass(AuthController, {
			lifetime: Lifetime.SINGLETON,
		}),
		userController: asClass(UserController, {
			lifetime: Lifetime.SINGLETON,
		}),
	});

	app.register(dbPlugin);

	const authController = diContainer.resolve('authController');
	app.get('/auth/facebook/init', authController.facebookInit);
	app.get('/auth/facebook/signup', authController.facebookSignup);

	const userController = diContainer.resolve('userController');
	app.get('/users', userController.index);

	return app;
};
