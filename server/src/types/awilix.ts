import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/UserController';

declare module '@fastify/awilix' {
	interface Cradle {
		dbClient: PrismaClient;

		userController: UserController;
	}
}
