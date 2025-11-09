
type Method = 'get' | 'post' | 'put' | 'delete';

type FetchConfig = {
};

type ApiEndpoint = <TResponse>(endpoint: `/${string}`, options?: FetchConfig) => Promise<TResponse>;

type Api = Record<Method, ApiEndpoint>;

type EndpointConfig<T, Meta extends Record<string, any>> = ({
    baseUrl,
    meta,
    api,
}: {
    baseUrl: string;
    meta: Meta;
    api: Api;
}) => T;

export function createApiClient<T, Meta extends Record<string, any> = {}>({
    baseUrl: _baseUrl,
    endpoints,
    meta = {} as Meta,
}: {
    baseUrl: string;
    endpoints: EndpointConfig<T, Meta>;
    meta?: Meta;
}){
    const baseUrl = _baseUrl.endsWith('/') ? _baseUrl.slice(0, -1) : _baseUrl;

    async function _fetch<TResponse>(method: Method, endpoint: `/${string}`, options: FetchConfig = {}){
        const res = await fetch(`${baseUrl}${endpoint}`, options);
        return await res.json() as TResponse;
    }

    return endpoints({
        baseUrl,
        meta,
        api: {
            delete: (endpoint, options) => _fetch('delete', endpoint, options),
            get: (endpoint, options) => _fetch('get', endpoint, options),
            post: (endpoint, options) => _fetch('post', endpoint, options),
            put: (endpoint, options) => _fetch('put', endpoint, options),
        },
    });
}
