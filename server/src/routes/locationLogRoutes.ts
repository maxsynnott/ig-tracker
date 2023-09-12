import { isAuthenticated } from '../authorizers/isAuthenticated';
import { LocationLogCreateRouteSchema } from '../schemas/LocationLogCreateRouteSchema';
import { LocationLogIndexRouteSchema } from '../schemas/LocationLogIndexRouteSchema';
import { DependencyFactory } from '../types/awilix';
import { zodRouteSchemaToFastifySchema } from '../utils/zodRouteSchemaToFastifySchema';

export const locationLogRoutesFactory: DependencyFactory<
	'locationLogRoutes'
> = (dependencies) => {
	const locationLogController = dependencies.locationLogController;

	return async (app) => {
		app.route({
			method: 'GET',
			url: '/location-logs',
			handler: locationLogController.index,
			schema: zodRouteSchemaToFastifySchema(LocationLogIndexRouteSchema),
		});

		app.route({
			method: 'POST',
			url: '/location-logs',
			preHandler: [isAuthenticated],
			handler: locationLogController.create,
			schema: zodRouteSchemaToFastifySchema(LocationLogCreateRouteSchema),
		});
	};
};
