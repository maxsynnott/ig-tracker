import { preHandlerAsyncHookHandler } from 'fastify';
import { UnauthenticatedException } from '../exceptions/UnauthenticatedException';

export const isAuthenticated: preHandlerAsyncHookHandler = async (req, res) => {
	if (!req.currentUser) {
		throw new UnauthenticatedException();
	}
};
