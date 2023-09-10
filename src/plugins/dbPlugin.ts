import createFastifyPlugin from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from '../clients/prismaClient';

declare module 'fastify' {
	interface FastifyInstance {
		db: PrismaClient;
	}
}

export const dbPlugin: FastifyPluginAsync = createFastifyPlugin(
	async (server, options) => {
		await prismaClient.$connect();

		server.decorate('db', prismaClient);

		server.addHook('onClose', async (server) => {
			await server.db.$disconnect();
		});
	},
);
