type EndpointConfig<T, Meta extends Record<string, any>> = ({
    baseUrl,
    meta,
}: {
    baseUrl: string;
    meta?: Meta;
}) => T;

export function createApiClient<T, Meta extends Record<string, any>>({
    baseUrl: _baseUrl,
    endpoints,
    meta,
}: {
    baseUrl: string;
    endpoints: EndpointConfig<T, Meta>;
    meta?: Meta;
}){
    const baseUrl = _baseUrl.endsWith('/') ? _baseUrl.slice(0, -1) : _baseUrl;
    return endpoints({baseUrl, meta});
}

const client = createApiClient({
    baseUrl: 'https://vpic.nhtsa.dot.gov/api/',
    meta: {
        apiToken: 'apple',
    },
    endpoints: ({baseUrl, meta}) => ({
        decodeVin: async (vin: string) => {
            const response = await fetch(`${baseUrl}/vehicles/decodevinvalues/${vin}?format=json`);
            const json = await response.json();
            return json.Results[0] as string;
        }
    }),
});

await client.decodeVin('1HGCM82633A123456');