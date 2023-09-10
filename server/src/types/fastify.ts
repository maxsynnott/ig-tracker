import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
	interface FastifyInstance {
		db: PrismaClient;
	}
}
