import { PrismaClient } from '@prisma/client';
import { DependencyFactory } from '../types/awilix';

export const dbClientFactory: DependencyFactory<'dbClient'> = () => {
	const prismaClient = new PrismaClient();

	return prismaClient;
};
