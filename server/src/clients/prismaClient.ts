import { PrismaClient } from '@prisma/client';
import { FunctionReturning } from 'awilix';

export const prismaClientFactory: FunctionReturning<PrismaClient> = () => {
	const prismaClient = new PrismaClient();

	return prismaClient;
};
