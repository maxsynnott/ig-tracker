import { PrismaClient, User } from '@prisma/client';

declare module 'fastify' {
	interface FastifyInstance {
		db: PrismaClient;
	}

	interface FastifyRequest {
		currentUser?: User;
	}
}
