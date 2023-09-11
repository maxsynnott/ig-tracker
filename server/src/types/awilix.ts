import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';

declare module '@fastify/awilix' {
	interface Cradle {
		dbClient: PrismaClient;

		authController: AuthController;
		userController: UserController;
	}
}
