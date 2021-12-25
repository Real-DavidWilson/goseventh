import { createSocket } from "dgram";

const socket = createSocket("udp4");
socket.bind(3302);

socket.on("error", (err) => {
	console.error(err);
});

export default socket;
