import { Cradle } from '@fastify/awilix';
import { RouteHandler } from 'fastify';
import { LocationLogIndexRouteSchema } from '../schemas/LocationLogIndexRouteSchema';
import { LocationLogCreateRouteSchema } from '../schemas/LocationLogCreateRouteSchema';
import { locationLogMapper } from '../mappers/locationLogMapper';

export class LocationLogController {
	private locationLogService;

	constructor(dependencies: Cradle) {
		this.locationLogService = dependencies.locationLogService;
	}

	index: RouteHandler<LocationLogIndexRouteSchema> = async (req, res) => {
		const locationLogs = await this.locationLogService.findMany();

		const response = locationLogs.map(locationLogMapper.toResponse);
		res.status(200).send(response);
	};

	create: RouteHandler<LocationLogCreateRouteSchema> = async (req, res) => {
		const { latitude, longitude, timestamp, userId } = req.body;

		const locationLog = await this.locationLogService.create({
			latitude,
			longitude,
			timestamp,
			userId,
		});

		const response = locationLogMapper.toResponse(locationLog);
		res.status(201).send(response);
	};
}
