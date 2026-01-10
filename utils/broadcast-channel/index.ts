declare global {
	interface BroadcastChannelMap {}
}

export type BroadcastChannelEventHandler<MessageData> = (
	event: MessageEvent<MessageData>
) => void;

export type BroadcastChannelRecordOptions<MessageData> = {
	onMessage?: BroadcastChannelEventHandler<MessageData>;
	onMessageError?: BroadcastChannelEventHandler<MessageData>;
};

export type BroadcastChannelStoreRecord = {
	channel: BroadcastChannel;
	handles: Set<BroadcastChannelRecordOptions<any>>;
};

const store = new Map<string, BroadcastChannelStoreRecord>();

const getOrCreateChannelRecord = (name: string) => {
	if (store.has(name)) return store.get(name)!;
	const channel = new BroadcastChannel(name);
	const channelRecord: BroadcastChannelStoreRecord = {
		channel,
		handles: new Set(),
	};
	store.set(name, channelRecord);
	return channelRecord;
};

export const subscribe = <
	Name extends keyof BroadcastChannelMap,
	MessageData = BroadcastChannelMap[Name]
>(
	name: Name,
	options: BroadcastChannelRecordOptions<MessageData>
) => {
	const channelRecord = getOrCreateChannelRecord(name);
	channelRecord.handles.add(options);
	if (options.onMessage)
		channelRecord.channel.addEventListener('message', options.onMessage);
	if (options.onMessageError)
		channelRecord.channel.addEventListener(
			'messageerror',
			options.onMessageError
		);

	return [
		channelRecord.channel.postMessage as (data: MessageData) => void,
		() => {
			unsubscribe<MessageData>(name, options);
		},
	] as const;
};

const unsubscribe = <MessageData>(
	name: string,
	options: BroadcastChannelRecordOptions<MessageData>
) => {
	const channelRecord = getOrCreateChannelRecord(name);
	channelRecord.handles.delete(options);
	if (options.onMessage)
		channelRecord.channel.removeEventListener('message', options.onMessage);
	if (options.onMessageError)
		channelRecord.channel.removeEventListener(
			'messageerror',
			options.onMessageError
		);
	if (channelRecord.handles.size === 0) {
		channelRecord.channel.close();
		store.delete(name);
	}
};
