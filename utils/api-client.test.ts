import { createApiClient } from './api-client';
import { uriUtil } from './uri';

const client = createApiClient({
	baseUrl: 'https://vpic.nhtsa.dot.gov/api/',
	basicToken: () => 'apple',
	bearer: [
		async () => {
			//simulate bearer token not set
			if (true) throw new Error('Bearer token not set');
			return 'pear';
		},
		async (token) => {
			//setting token
		},
	],
	meta: {
		// apiToken: 'apple',
	},
	staticHeaders: {
		'X-Api-Key': '123',
	},
	endpoints: ({ api, bearer: [, setBearerToken], meta }) => ({
		login: async (signal?: AbortSignal) => {
			const res = await api.get(uriUtil`/account/login`, {
				body: {
					username: 'apple',
					password: 'pear',
				},
				tokenType: 'basic',
				signal,
			});
			const json = await res.json();
			setBearerToken(json.access_token);
		},
		decodeVin: async (vin: string, signal?: AbortSignal) => {
			const res = await api.get(
				uriUtil`/vehicles/decodevinvalues/${vin}?format=json`,
				{ signal }
			);
			const json = await res.json();
			return json.Results[0] as string;
		},
	}),
});

await client.decodeVin('1HGCM82633A123456');
