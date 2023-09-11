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
};
