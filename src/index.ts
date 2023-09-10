import fastify from 'fastify';

const server = fastify({
	logger: true,
});

server.get('/', async (req, res) => {
	return { message: 'Hello World!' };
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
