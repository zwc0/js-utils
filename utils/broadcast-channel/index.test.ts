import { subscribe } from '.';

declare global {
	interface BroadcastChannelMap {
		key: {
			a: number;
		};
	}
}

const [postMessage, unsubscribe] = subscribe('key', {
	onMessage: (e) => {
		e.data.a;
	},
});

postMessage({ a: 1 });

unsubscribe();
