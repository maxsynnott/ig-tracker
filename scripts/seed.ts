import { prismaClient as db } from '../src/clients/prismaClient';

const seed = async () => {
	await db.user.create({
		data: {
			handle: '@johnappleseed',
			email: 'john.applessed@example.com',
		},
	});
};

seed();
