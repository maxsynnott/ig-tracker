export class HttpException extends Error {
	readonly statusCode: number;

	constructor(message = 'Something went wrong', statusCode = 500) {
		super(message);
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}
