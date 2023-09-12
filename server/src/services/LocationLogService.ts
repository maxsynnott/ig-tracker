import { Cradle } from '@fastify/awilix';
import { LocationLog, Prisma } from '@prisma/client';

type CreateInput = Pick<
	Prisma.LocationLogUncheckedCreateInput,
	'latitude' | 'longitude' | 'timestamp' | 'userId'
>;

export class LocationLogService {
	private dbClient;

	constructor(dependencies: Cradle) {
		this.dbClient = dependencies.dbClient;
	}

	create = async ({
		latitude,
		longitude,
		timestamp,
		userId,
	}: CreateInput): Promise<LocationLog> => {
		const locationLog = await this.dbClient.locationLog.create({
			data: {
				latitude,
				longitude,
				timestamp,
				userId,
			},
		});

		return locationLog;
	};

	findMany = async (
		input?: Prisma.LocationLogFindManyArgs,
	): Promise<LocationLog[]> => {
		const locationLogs = await this.dbClient.locationLog.findMany(input);

		return locationLogs;
	};
}
