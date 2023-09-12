import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import fastifyEnv from '@fastify/env';
import { JSONSchemaType } from 'env-schema';
import { EnvVars } from './types/env';
import fastifyCookie from '@fastify/cookie';
import { registerDiContainerDependencies } from './container';

registerDiContainerDependencies();

const envVarsSchema: JSONSchemaType<EnvVars> = {
	type: 'object',
	required: [
		'DATABASE_URL',
		'FACEBOOK_CLIENT_ID',
		'FACEBOOK_CLIENT_SECRET',
		'COOKIE_SECRET',
	],
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
		COOKIE_SECRET: {
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
	app.register(fastifyCookie, {
		secret: app.config.COOKIE_SECRET,
	});
	app.register(fastifyAwilixPlugin, {
		asyncDispose: true,
		disposeOnClose: true,
		disposeOnResponse: true,
	});
	app.register(dbPlugin);

	const sessionCookieAuthenticator = diContainer.resolve(
		'sessionCookieAuthenticator',
	);
	app.addHook('preHandler', sessionCookieAuthenticator);

	const authRoutes = diContainer.resolve('authRoutes');
	app.register(authRoutes);

	const userRoutes = diContainer.resolve('userRoutes');
	app.register(userRoutes);

	const locationLogRoutes = diContainer.resolve('locationLogRoutes');
	app.register(locationLogRoutes);

	return app;
};
