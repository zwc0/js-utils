type Method = 'get' | 'post' | 'put' | 'delete';

type Headers = {
	[key: string]: string;
} & {
	Authorization?: `Basic ${string}` | `Bearer ${string}` | (string & {});
	'Content-Type'?:
		| 'application/json'
		| 'application/x-www-form-urlencoded'
		| (string & {});
};

type FetchConfig = {
	headers?: Headers;
	body?: Record<string, any> | FormData;
};

type ApiEndpoint = (
	endpoint: `/${string}`,
	options?: FetchConfig
) => Promise<Response>;

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
}) {
	const baseUrl = _baseUrl.endsWith('/') ? _baseUrl.slice(0, -1) : _baseUrl;

	/**
	 * Fetch wrapper
	 * @throws {Response} if response is not ok
	 */
	async function _fetch(
		method: Method,
		endpoint: `/${string}`,
		options: FetchConfig = {}
	) {
		const res = await fetch(`${baseUrl}${endpoint}`, {
			method,
			headers: {
				'Content-Type':
					options.body instanceof FormData
						? 'application/x-www-form-urlencoded'
						: 'application/json',
				...options.headers,
			} satisfies Headers,
			body: !options.body
				? undefined
				: options.body instanceof FormData
				? options.body
				: JSON.stringify(options.body),
		});
		if (!res.ok) throw res;
		return res;
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
