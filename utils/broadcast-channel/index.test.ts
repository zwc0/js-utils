import { subscribe } from '.';

const [postMessage, unsubscribe] = subscribe<{ a: number }>('key', {
	onMessage: (e) => {
		e.data.a;
	},
});

postMessage({ a: 1 });

unsubscribe();
