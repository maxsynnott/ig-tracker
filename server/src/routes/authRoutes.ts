import { DependencyFactory } from '../types/awilix';

export const authRoutesFactory: DependencyFactory<'authRoutes'> = (
	dependencies,
) => {
	const authController = dependencies.authController;

	return async (app) => {
		app.get('/auth/facebook/init', authController.facebookInit);
		app.get('/auth/facebook/signup', authController.facebookSignup);
		app.get('/auth/facebook/signin', authController.facebookSignin);
	};
};
