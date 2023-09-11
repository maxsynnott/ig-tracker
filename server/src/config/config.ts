export const config = {
	host: 'http://localhost:8080',
	port: 8080,
	oauth: {
		providers: {
			facebook: {
				baseUrl: 'https://www.facebook.com/v17.0',
				graphApiBaseUrl: 'https://graph.facebook.com/v17.0',
			},
		},
	},
	redis: {
		host: 'localhost',
		port: 6379,
	},
	session: {
		ttl: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
	},
	cookie: {
		defaultOptions: {
			httpOnly: true,
			path: '/',
			domain: 'localhost',
			sameSite: 'lax' as const,
			signed: true,
		},
	},
};
