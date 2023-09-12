import { DependencyFactory } from '../types/awilix';

export const sessionCookieAuthenticatorFactory: DependencyFactory<
	'sessionCookieAuthenticator'
> = (dependencies) => {
	const sessionService = dependencies.sessionService;
	const dbClient = dependencies.dbClient;

	return async (req, res) => {
		const signedSessionCookie = req.cookies.session;
		if (!signedSessionCookie) return;
		const { valid, value: sessionId } =
			req.server.unsignCookie(signedSessionCookie);
		if (!valid || !sessionId) return;

		const session = await sessionService.getById(sessionId);
		if (!session) return;

		const user = await dbClient.user.findUnique({
			where: { id: session.userId },
		});
		if (user) {
			req.currentUser = user;
		}
	};
};
