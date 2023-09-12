import { z } from 'zod';
import { LocationLogResponse } from './responses/LocationLogResponse';

const Reply = z.object({ 200: z.array(LocationLogResponse) });

export const LocationLogIndexRouteSchema = z.object({
	Reply,
});

export type LocationLogIndexRouteSchema = z.infer<
	typeof LocationLogIndexRouteSchema
>;
