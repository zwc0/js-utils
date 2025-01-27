type UriComponent = string | number | boolean;
type UriComponentRecord = Record<string, UriComponent>;

/** Test method for verifying path typing. */
const pathTest = (s: `/${string}`) => s;

/** Encode search params
 * @example searchParamUtil({
		userId: 2,
		active: false,
	}); //->"userId=2&active=false"
*/
const searchParamUtil = (params: UriComponentRecord) =>
	Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&');

/** Encode path params or search params.
 * @warning Prefix is not enforced as tagged template literals cannot be completely type-safe at this time.
 * 	The prefix is only for potential external type requirements.
 * @example pathUtil`/users/${1}?${{active:false}}` //->"/users/123"
 */
const uriUtil = <TPrefix extends string = '/'>(
	parts: TemplateStringsArray,
	...params: Readonly<UriComponent | UriComponentRecord>[]
): `${TPrefix}${string}` =>
	String.raw(
		parts,
		...params.map((x) =>
			x instanceof Object
				? searchParamUtil(x)
				: encodeURIComponent(`${x}`)
		)
	) as `${TPrefix}${string}`;

/** Encode path params or search params.
 * @example pathUtil({
		path: `/users/$id`,
		params: { id: 1 },
		searchParams: { active: false },
	}) //->"/users/1?active=false"
 */
const pathUtil = <TPrefix extends string = '/'>({
	path,
	params = {},
	searchParams = {},
}: Readonly<{
	path: `${TPrefix}${string}`;
	params?: UriComponentRecord;
	searchParams?: UriComponentRecord;
}>) => {
	let result: string = path;
	if (params)
		Object.entries(params).forEach(
			([k, v]) =>
				(result = result.replace(`$${k}`, encodeURIComponent(v)))
		);
	if (searchParams) result += `?${searchParamUtil(searchParams)}`;
	return result as `${TPrefix}${string}`;
};
