import { buildApp } from './app';
import { config } from './config/config';

const start = async () => {
	const app = await buildApp({ logger: true });

	try {
		await app.listen({ port: config.port });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

start();
