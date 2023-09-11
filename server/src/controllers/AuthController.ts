import { Cradle } from '@fastify/awilix';
import axios from 'axios';
import { RouteHandler } from 'fastify';
import { config } from '../config/config';

export class AuthController {
	private dbClient;

	private sessionService;

	constructor(dependencies: Cradle) {
		this.dbClient = dependencies.dbClient;

		this.sessionService = dependencies.sessionService;
	}

	facebookInit: RouteHandler = async (req, res) => {
		// @ts-ignore
		const intent = req.query.intent;
		if (!intent) {
			throw new Error('No intent provided');
		}

		const url = `${config.oauth.providers.facebook.baseUrl}/dialog/oauth`;
		const params = new URLSearchParams({
			client_id: req.server.config.FACEBOOK_CLIENT_ID,
			redirect_uri: `${config.host}/auth/facebook/${intent}`,
			response_type: 'code',
			scope: ['email', 'public_profile'].join(','),
		});

		res.redirect(`${url}?${params.toString()}`);
	};

	// TODO: Add unique constraint checks
	facebookSignup: RouteHandler = async (req, res) => {
		// @ts-ignore
		const code: string | undefined = req.query?.code;
		if (!code) {
			throw new Error('No code provided');
		}

		// Get access token
		const {
			data: { access_token: accessToken },
		} = await axios.get<{
			access_token: string;
			token_type: string;
			expires_in: number;
		}>(
			`${config.oauth.providers.facebook.graphApiBaseUrl}/oauth/access_token`,
			{
				params: {
					client_id: req.server.config.FACEBOOK_CLIENT_ID,
					client_secret: req.server.config.FACEBOOK_CLIENT_SECRET,
					redirect_uri: `${config.host}/auth/facebook/signup`,
					code,
				},
			},
		);

		// Get user info
		const {
			data: { email, id: facebookUserId, first_name: firstName },
		} = await axios.get<{ email: string; id: string; first_name: string }>(
			`${config.oauth.providers.facebook.graphApiBaseUrl}/me`,
			{
				params: {
					access_token: accessToken,
					fields: ['id', 'email', 'first_name'].join(','),
				},
			},
		);

		const sanitizedFirstName = firstName.replace(/[^a-zA-Z]/g, '');
		const randNum = Math.floor(Math.random() * 10000);
		const handle = `${sanitizedFirstName}${randNum}`;

		const user = await this.dbClient.user.create({
			data: {
				email,
				handle,
				connectedFacebookUserId: facebookUserId,
			},
		});

		res.status(201).send(user);
	};

	facebookSignin: RouteHandler = async (req, res) => {
		// @ts-ignore
		const code: string | undefined = req.query?.code;
		if (!code) {
			throw new Error('No code provided');
		}

		// Get access token
		const {
			data: { access_token: accessToken },
		} = await axios.get<{
			access_token: string;
			token_type: string;
			expires_in: number;
		}>(
			`${config.oauth.providers.facebook.graphApiBaseUrl}/oauth/access_token`,
			{
				params: {
					client_id: req.server.config.FACEBOOK_CLIENT_ID,
					client_secret: req.server.config.FACEBOOK_CLIENT_SECRET,
					redirect_uri: `${config.host}/auth/facebook/signin`,
					code,
				},
			},
		);

		// Get user info
		const {
			data: { id: facebookUserId },
		} = await axios.get<{ email: string; id: string; first_name: string }>(
			`${config.oauth.providers.facebook.graphApiBaseUrl}/me`,
			{
				params: {
					access_token: accessToken,
					fields: ['id'].join(','),
				},
			},
		);

		const user = await this.dbClient.user.findUniqueOrThrow({
			where: { connectedFacebookUserId: facebookUserId },
			select: {
				id: true,
			},
		});

		const session = await this.sessionService.create({
			userId: user.id,
		});

		res.setCookie('session', session.id, config.cookie.defaultOptions);

		res.status(200).send(null);
	};
}
