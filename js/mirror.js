const { createSocket } = require("dgram");

const dgramPort = 3302;

const client = createSocket("udp4");

client.connect(dgramPort, "localhost", () => {
	client.on("message", (msg, rinfo) => {
		try {
			const data = JSON.parse(msg.toString());
			console.log(data);
			if (data?.eventName == "OnPlayerConnect") {
				client.send(
					JSON.stringify({
						type: "callFunction",
						name: "SetPlayerName",
						params: [data.params[0], "bbn$"],
						paramsType: "is",
						uid: 0,
						awaitReturn: false,
					})
				);

				setInterval(() => {
					client.send(
						JSON.stringify({
							type: "callFunction",
							name: "GetPlayerName",
							params: [data.params[0], 24],
							paramsType: "iSi",
							uid: 0,
						})
					);
				}, 1);

				/* 
				for (let i = 0; i < 100; i++) {
					client.send(
						JSON.stringify({
							type: "callFunction",
							name: "GetPlayerName",
							params: [data.params[0]],
							paramsType: "iS",
							uid: 0,
						})
					);
				} 
				*/
			}
		} catch {}
	});

	client.send(
		JSON.stringify({
			type: "listenEvent",
			eventName: "OnPlayerConnect",
		})
	);
});

client.addListener("connect", () => {
	console.log("Client: self connected on server.");
});

client.addListener("error", (err) => {
	console.error(err);
});
