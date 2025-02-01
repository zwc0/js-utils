import { uriUtil } from './uri';

type PrefixSlash = `/${string}`;

const testUriUtilPath: PrefixSlash = uriUtil`/apples?${{ a: 1 }}`;
// const testUriUtilPathFail: PrefixSlash = uriUtil<`a`>`/apples?${{a:1}}`;
