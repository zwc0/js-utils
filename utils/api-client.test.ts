import { createApiClient } from './api-client';
import { uriUtil } from './uri';

const client = createApiClient({
	baseUrl: 'https://vpic.nhtsa.dot.gov/api/',
	meta: {
		apiToken: 'apple',
	},
	endpoints: ({ api, meta }) => ({
		decodeVin: async (vin: string) => {
			const res = await api.get(
				uriUtil`/vehicles/decodevinvalues/${vin}?format=json`
			);
			const json = await res.json();
			return json.Results[0] as string;
		},
	}),
});

await client.decodeVin('1HGCM82633A123456');
