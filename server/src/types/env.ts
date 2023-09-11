export type EnvVars = {
	DATABASE_URL: string;
	FACEBOOK_CLIENT_ID: string;
	FACEBOOK_CLIENT_SECRET: string;
	COOKIE_SECRET: string;
};

declare module 'fastify' {
	interface FastifyInstance {
		config: EnvVars;
	}
}
