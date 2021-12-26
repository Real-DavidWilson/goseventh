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

const listeningEvents = {};

function storeEvent(eventName: string, rinfo: RemoteInfo) {
	const key = rinfo.address.replace(".", "");
	if (!Array.isArray(listeningEvents[key])) listeningEvents[key] = [];
	(listeningEvents[key] as Array<string>).push(eventName);
}

function hasEvent(eventName, rinfo: RemoteInfo) {
	const key = rinfo.address.replace(".", "");
	if (!Array.isArray(listeningEvents[key])) return false;
	return !!(listeningEvents[key] as Array<string>).find(
		(v) => v === eventName
	);
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
	{ eventName, defaultReturn }: ListenEventData,
	rinfo: RemoteInfo
) {
	if (!eventName || typeof eventName !== "string") return;
	if (hasEvent(eventName, rinfo)) {
		console.log(`event ${eventName} already registed`);
		return;
	}

	console.log(`Event ${eventName} registed.`, listeningEvents);
	samp.on(eventName, (...params: any[]) => {
		const dataSend: SendEventData = {
			eventName,
			type: "onEvent",
			params,
		};

		try {
			socket.send(JSON.stringify(dataSend), rinfo.port);
		} catch (err){
			console.error(err)
		}

		if (defaultReturn !== undefined) return defaultReturn;
	});

	storeEvent(eventName, rinfo);
}
