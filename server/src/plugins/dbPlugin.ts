import createFastifyPlugin from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

export const dbPlugin: FastifyPluginAsync = createFastifyPlugin(
	async (server, options) => {
		const prismaClient = server.diContainer.resolve('dbClient');

		await prismaClient.$connect();

		server.decorate('db', prismaClient);

		server.addHook('onClose', async (server) => {
			await server.db.$disconnect();
		});
	},
);
