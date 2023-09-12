import { Cradle } from '@fastify/awilix';
import { generateUuid } from '../utils/generateUuid';
import { Session } from '../types/types';
import { config } from '../config/config';

type CreateInput = Pick<Session, 'userId'>;

export class SessionService {
	private redisClient;

	constructor(dependencies: Cradle) {
		this.redisClient = dependencies.redisClient;
	}

	create = async ({ userId }: CreateInput): Promise<Session> => {
		const id = generateUuid();
		const ttl = config.session.ttl;

		await this.redisClient.set(id, userId);
		await this.redisClient.pexpire(id, ttl);

		return { id, userId, ttl };
	};

	getById = async (id: string): Promise<Session | null> => {
		const [userId, ttl] = await Promise.all([
			this.redisClient.get(id),
			this.redisClient.pttl(id),
		]);

		if (!userId) return null;

		return { id, userId, ttl };
	};

	deleteById = async (id: string) => {
		await this.redisClient.del(id);
	};
}
