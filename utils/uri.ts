/** Encode path params
 * @example pathUtil`/users/${id}` //->"/users/123"
 */
const pathUtil = (parts: TemplateStringsArray, ...params: unknown[]): string =>
	String.raw(parts, ...params.map((x) => encodeURIComponent(`${x}`)));

/** Encode query params
 * @example queryUtil({
		userId: 2,
		active: false,
	}); //->"userId=2&active=false"
*/
const queryUtil = (params: Record<string, string | number | boolean>) =>
	Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join("&");
