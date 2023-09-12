import { DependencyFactory } from '../types/awilix';

export const userRoutesFactory: DependencyFactory<'userRoutes'> = (
	dependencies,
) => {
	const userController = dependencies.userController;

	return async (app) => {
		app.get('/users', userController.index);
		app.get('/users/current', userController.current);
	};
};
