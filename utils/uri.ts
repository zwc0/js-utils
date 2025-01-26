/** Encode path params.
 * @warning Prefix is not enforced as tagged template literals cannot be completely type-safe at this time.
 * 	The prefix is only for potential external type requirements.
 * @example pathUtil`/users/${id}` //->"/users/123"
 */
const pathUtil = <TPrefix extends string = '/'>(
	parts: TemplateStringsArray,
	...params: Readonly<unknown>[]
): `${TPrefix}${string}` =>
	String.raw(
		parts,
		...params.map((x) => encodeURIComponent(`${x}`))
	) as `${TPrefix}${string}`;

/** Encode query params
 * @example queryUtil({
		userId: 2,
		active: false,
	}); //->"userId=2&active=false"
*/
const queryUtil = (params: Record<string, string | number | boolean>) =>
	Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&');
