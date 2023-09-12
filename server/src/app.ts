import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { UserController } from './controllers/UserController';
import { Lifetime, asClass, asFunction } from 'awilix';
import { prismaClientFactory } from './clients/prismaClient';
import fastifyEnv from '@fastify/env';
import { JSONSchemaType } from 'env-schema';
import { EnvVars } from './types/env';
import { AuthController } from './controllers/AuthController';
import { redisClientFactory } from './clients/redisClient';
import { SessionService } from './services/SessionService';
import fastifyCookie from '@fastify/cookie';

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
	diContainer.register({
		dbClient: asFunction(prismaClientFactory, {
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
	});

	app.register(dbPlugin);

	const dbClient = diContainer.resolve('dbClient');
	const sessionService = diContainer.resolve('sessionService');
	app.addHook('preHandler', async (req, res) => {
		const signedSessionCookie = req.cookies.session;
		if (!signedSessionCookie) return;
		const { valid, value: sessionId } =
			app.unsignCookie(signedSessionCookie);
		if (!valid || !sessionId) return;

		const session = await sessionService.getById(sessionId);
		if (!session) return;

		const user = await dbClient.user.findUnique({
			where: { id: session.userId },
		});
		if (user) {
			req.currentUser = user;
		}
	});

	const authController = diContainer.resolve('authController');
	app.get('/auth/facebook/init', authController.facebookInit);
	app.get('/auth/facebook/signup', authController.facebookSignup);
	app.get('/auth/facebook/signin', authController.facebookSignin);

	const userController = diContainer.resolve('userController');
	app.get('/users', userController.index);
	app.get('/users/current', userController.current);

	return app;
};
