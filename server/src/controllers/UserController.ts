import { Cradle } from '@fastify/awilix';
import { RouteHandler } from 'fastify';

export class UserController {
	private dbClient;

	constructor(dependencies: Cradle) {
		this.dbClient = dependencies.dbClient;
	}

	index: RouteHandler = async (req, res) => {
		const users = this.dbClient.user.findMany();

		return users;
	};
}
