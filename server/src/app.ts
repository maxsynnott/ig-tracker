import fastify, { FastifyServerOptions } from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';

export const buildApp = (options?: FastifyServerOptions) => {
	const app = fastify(options);

	app.register(dbPlugin);

	app.get('/', async (req, res) => {
		return { message: 'Hello World!' };
	});

	app.get('/users', async (req, res) => {
		const users = await app.db.user.findMany();
		return users;
	});

	return app;
};
