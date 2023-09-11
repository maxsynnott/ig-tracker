import { buildApp } from './app';

const start = async () => {
	const app = await buildApp({ logger: true });

	try {
		await app.listen({ port: 3000 });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

start();
