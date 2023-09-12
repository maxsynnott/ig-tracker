import { diContainer } from '@fastify/awilix';

const seed = async () => {
	const dbClient = diContainer.resolve('dbClient');

	await dbClient.user.create({
		data: {
			handle: '@johnappleseed',
			email: 'john.appleseed@example.com',
		},
	});
};

seed();
