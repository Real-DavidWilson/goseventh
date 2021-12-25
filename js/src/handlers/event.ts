import { RemoteInfo } from "dgram";
import socket from "../socket";

interface ListenEventData {
	type: "listenEvent";
	eventName: string;
	defaultReturn?: any;
}

interface SendEventData {
	type: "onEvent";
	eventName: string;
	params: any[];
}

socket.on("message", (msg, rinfo) => {
	try {
		const { eventName, type, defaultReturn } = JSON.parse(
			msg.toString()
		) as ListenEventData;
		if (type !== "listenEvent") return;
		listenEventHandler({ eventName, type, defaultReturn }, rinfo);
	} catch {}
});

function listenEventHandler(
	{ eventName, type, defaultReturn }: ListenEventData,
	rinfo: RemoteInfo
) {
	if (!eventName || typeof eventName !== "string") return;

	samp.on(eventName, (...params: any[]) => {
		const dataSend: SendEventData = {
			eventName,
			type: "onEvent",
			params,
		};

		try {
			socket.send(JSON.stringify(dataSend), rinfo.port);
		} catch {}

		if (defaultReturn !== undefined) return defaultReturn;
	});
}
