import { RemoteInfo } from "dgram";
import socket from "../socket";

interface CallFunctionData {
	type: "callFunction";
	functionName: string;
	params?: any[];
	paramsType?: string;
	uid?: string;
	awaitReturn?: boolean;
}

interface SendFunctionData {
	type: "functionReturn";
	functionName: string;
	data: any[] | any;
	uid?: string;
}

socket.on("message", (msg, rinfo) => {
	try {
		const { type, ...data } = JSON.parse(
			msg.toString()
		) as CallFunctionData;
		if (type !== "callFunction") return;
		callFunctionsHandler(data, rinfo);
	} catch {}
});

function callFunctionsHandler(
	data: Omit<CallFunctionData, "type">,
	rinfo: RemoteInfo
) {
	if (typeof data.paramsType !== "string") data.paramsType = "";
	if (typeof data.functionName !== "string" || !data.functionName) return;
	if (typeof data.awaitReturn !== "boolean") data.awaitReturn = true;
	const isFloatFunction = data.paramsType
		.split("")
		.map((p) => p === "f")
		.reduce((p, c) => p || c);
	let dataNative: any | any[];

	if (isFloatFunction)
		dataNative = samp.callNativeFloat(
			data.functionName,
			data.paramsType,
			...data.params
		);
	else dataNative = samp.callNative(data.functionName, data.paramsType, ...data.params);

    if (data.awaitReturn) {
        console.log("sending data....")
		socket.send(
			JSON.stringify({
				functionName: data.functionName,
				uid: data.uid,
				type: "functionReturn",
				data: dataNative,
			} as SendFunctionData),
			rinfo.port
		);
	}
}
