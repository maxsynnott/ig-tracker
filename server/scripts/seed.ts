import { prismaClient as db } from '../src/clients/prismaClient';

const seed = async () => {
	await db.user.create({
		data: {
			handle: '@johnappleseed',
			email: 'john.appleseed@example.com',
		},
	});
};

seed();
