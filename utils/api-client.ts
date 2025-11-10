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
	body?: Record<string, any> | FormData;
	/** @default 'include' */
	credentials?: RequestCredentials;
	headers?: Headers;
	signal?: AbortSignal;
	/** @default 'bearer' */
	tokenType?: 'basic' | 'bearer' | 'none';
};

type ApiEndpoint = (
	endpoint: `/${string}`,
	options?: FetchConfig
) => Promise<Response>;

type Api = Record<Method, ApiEndpoint>;

type BearerGetSet = [
	getBearerToken: () => string | Promise<string>,
	setBearerToken: (token: string) => any | Promise<any>
];

type EndpointConfig<T, Meta extends Record<string, any>> = ({
	baseUrl,
	meta,
	api,
}: {
	baseUrl: string;
	bearer: BearerGetSet;
	meta: Meta;
	api: Api;
}) => T;

export function createApiClient<T, Meta extends Record<string, any> = {}>({
	baseUrl: _baseUrl,
	basicToken: _basicToken = () => '',
	bearer: [getBearerToken, setBearerToken] = [() => '', () => ''],
	endpoints,
	meta = {} as Meta,
	staticHeaders = {},
}: {
	baseUrl: string;
	basicToken?: () => string | Promise<string>;
	bearer?: BearerGetSet;
	endpoints: EndpointConfig<T, Meta>;
	meta?: Meta;
	staticHeaders?: Headers;
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
			body: !options.body
				? undefined
				: options.body instanceof FormData
				? options.body
				: JSON.stringify(options.body),
			credentials: options.credentials ?? 'include',
			method,
			headers: {
				Authorization:
					options.tokenType === 'none'
						? ''
						: options.tokenType === 'basic'
						? `Basic ${await _basicToken()}`
						: `Bearer ${await getBearerToken()}`,
				'Content-Type':
					options.body instanceof FormData
						? 'application/x-www-form-urlencoded'
						: 'application/json',
				...staticHeaders,
				...options.headers,
			} satisfies Headers,
            signal: options.signal,
		});
		if (!res.ok) throw res;
		return res;
	}

	return endpoints({
		baseUrl,
		bearer: [getBearerToken, setBearerToken],
		meta,
		api: {
			delete: (endpoint, options) => _fetch('delete', endpoint, options),
			get: (endpoint, options) => _fetch('get', endpoint, options),
			post: (endpoint, options) => _fetch('post', endpoint, options),
			put: (endpoint, options) => _fetch('put', endpoint, options),
		},
	});
}
