import { createApiClient } from "./api-client";
import { uriUtil } from "./uri";

const client = createApiClient({
    baseUrl: 'https://vpic.nhtsa.dot.gov/api/',
    meta: {
        apiToken: 'apple',
    },
    endpoints: ({api, meta}) => ({
        decodeVin: async (vin: string) => {
            const json = await api.get<any>(uriUtil`/vehicles/decodevinvalues/${vin}?format=json`);
            return json.Results[0] as string;
        },
    }),
});

await client.decodeVin('1HGCM82633A123456');