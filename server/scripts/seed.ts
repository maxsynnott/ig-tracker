import { prismaClientDependencyFactory } from '../src/clients/prismaClient';

const seed = async () => {
	const db = prismaClientDependencyFactory();

	await db.user.create({
		data: {
			handle: '@johnappleseed',
			email: 'john.appleseed@example.com',
		},
	});
};

seed();
