import fastify from 'fastify';
import { dbPlugin } from './plugins/dbPlugin';

const server = fastify({
	logger: true,
});

server.register(dbPlugin);

server.get('/', async (req, res) => {
	return { message: 'Hello World!' };
});

server.get('/users', async (req, res) => {
	const users = await server.db.user.findMany();
	return users;
});

const start = async () => {
	try {
		await server.listen({ port: 3000 });
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};
start();
