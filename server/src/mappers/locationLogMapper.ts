import { LocationLog } from '@prisma/client';
import { LocationLogResponse } from '../schemas/responses/LocationLogResponse';

export const locationLogMapper = {
	toResponse: (locationLog: LocationLog): LocationLogResponse => {
		return {
			id: locationLog.id,
			createdAt: locationLog.createdAt.toISOString(),
			updatedAt: locationLog.updatedAt.toISOString(),
			longitude: locationLog.longitude.toString(),
			latitude: locationLog.latitude.toString(),
			timestamp: locationLog.timestamp.toISOString(),
			userId: locationLog.userId,
		};
	},
};
