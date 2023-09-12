import { FastifySchema } from 'fastify';
import { AnyZodObject, ZodObject, ZodTypeAny } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

type ZodRouteSchema = ZodObject<{
	Body?: AnyZodObject;
	Headers?: AnyZodObject;
	Params?: AnyZodObject;
	Querystring?: AnyZodObject;
	Reply?: ZodObject<{ [key: string]: ZodTypeAny }>;
}>;

export const zodRouteSchemaToFastifySchema = <Schema extends ZodRouteSchema>({
	shape: { Reply, ...schemas },
}: Schema): FastifySchema => {
	const fastifySchema = Object.fromEntries(
		Object.entries(schemas).map(([key, value]) => {
			return [key.toLowerCase(), zodToJsonSchema(value)];
		}),
	);

	if (Reply) {
		fastifySchema.response = Object.fromEntries(
			Object.entries(Reply.shape).map(([key, value]) => {
				return [key, zodToJsonSchema(value)];
			}),
		);
	}

	return fastifySchema;
};
