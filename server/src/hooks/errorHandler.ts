import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { HttpException } from '../exceptions/HttpException';

export const errorHandler = (
	error: FastifyError | HttpException | Error,
	req: FastifyRequest,
	res: FastifyReply,
) => {
	res.status(error.statusCode ?? 500).send({
		error: error.name,
		message: error.message,
	});
};
