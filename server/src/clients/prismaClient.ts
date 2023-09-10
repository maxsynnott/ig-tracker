import { PrismaClient } from '@prisma/client';
import { FunctionReturning } from 'awilix';

export const prismaClientDependencyFactory: FunctionReturning<
	PrismaClient
> = () => {
	const prismaClient = new PrismaClient();

	return prismaClient;
};
