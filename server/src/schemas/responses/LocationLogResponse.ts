import { z } from 'zod';
import { decimalString } from '../utils/decimalString';

export const LocationLogResponse = z.object({
	id: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	longitude: decimalString(),
	latitude: decimalString(),
	timestamp: z.string().datetime(),
	userId: z.string().uuid(),
});

export type LocationLogResponse = z.infer<typeof LocationLogResponse>;
