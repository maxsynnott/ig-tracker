import { HttpException } from './HttpException';

export class UnauthenticatedException extends HttpException {
	constructor(message = 'Unauthenticated') {
		super(message, 401);
		this.name = this.constructor.name;
	}
}
