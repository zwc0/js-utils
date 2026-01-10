import { subscribe } from '.';

declare global {
	interface BroadcastChannelMap {
		key: {
			a: number;
		};
	}
}

const [unsubscribe, postMessage] = subscribe('key', {
	onMessage: (e) => {
		console.log(e.data.a);
	},
});

postMessage({ a: 1 });

unsubscribe();
