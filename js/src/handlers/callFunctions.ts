import { RemoteInfo } from "dgram";
import socket from "../socket";

interface CallFunctionData {
	type: "callFunction";
	name: string;
	params?: any[];
	paramsType?: string;
	uid?: string;
	awaitReturn?: boolean;
}

interface SendFunctionData {
	type: "functionReturn";
	name: string;
	data: any[] | any;
	uid?: string;
}

socket.on("message", (msg, rinfo) => {
	try {
		const { type, ...data } = JSON.parse(
			msg.toString()
		) as CallFunctionData;
		if (type !== "callFunction") return;
		console.log("callfunction");
		callFunctionsHandler(data, rinfo);
	} catch {}
});

function callFunctionsHandler(
	data: Omit<CallFunctionData, "type">,
	rinfo: RemoteInfo
) {
	if (typeof data.paramsType !== "string") data.paramsType = "";
	if (typeof data.name !== "string" || !data.name) return;
	if (typeof data.awaitReturn !== "boolean") data.awaitReturn = true;

	const isFloatFunction = data.paramsType
		.split("")
		.map((p) => p === "f")
		.reduce((p, c) => p || c);
	let dataNative: any | any[];

	if (isFloatFunction)
		dataNative = samp.callNativeFloat(
			data.name,
			data.paramsType,
			...data.params
		);
	else dataNative = samp.callNative(data.name, data.paramsType, ...data.params);

    console.log("await return?", data.awaitReturn, "Data:", dataNative);
    if (data.awaitReturn) {
        console.log("sending data....")
		socket.send(
			JSON.stringify({
				name: data.name,
				uid: data.uid,
				type: "functionReturn",
				data: dataNative,
			} as SendFunctionData),
			rinfo.port
		);
	}
}
