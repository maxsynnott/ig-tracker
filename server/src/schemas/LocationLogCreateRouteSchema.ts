import { z } from 'zod';
import { decimalString } from './utils/decimalString';
import { LocationLogResponse } from './responses/LocationLogResponse';

const Body = z.object({
	latitude: decimalString(),
	longitude: decimalString(),
	timestamp: z.string(),
	userId: z.string().uuid(),
});

const Reply = z.object({ 201: LocationLogResponse });

export const LocationLogCreateRouteSchema = z.object({
	Body,
	Reply,
});

export type LocationLogCreateRouteSchema = z.infer<
	typeof LocationLogCreateRouteSchema
>;
