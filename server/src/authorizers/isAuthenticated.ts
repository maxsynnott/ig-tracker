import { preHandlerAsyncHookHandler } from 'fastify';

export const isAuthenticated: preHandlerAsyncHookHandler = async (req, res) => {
	if (!req.currentUser) {
		throw new Error('UnauthenticatedException');
	}
};
