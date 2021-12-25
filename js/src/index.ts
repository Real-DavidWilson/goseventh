import socket from "./socket"
import "./handlers"

samp.registerEvent("UTF8_OnPlayerText", "is");
samp.registerEvent("UTF8_OnPlayerCommandText", "is");

samp.on("UTF8_OnPlayerText", (playerid, text) => {
    console.log(`${samp.callNative("GetPlayerName", "i", playerid)} say: ${text}.`);
    samp.callPublic(
		"UTF8_SendClientMessage",
		"iis",
		playerid,
		0xbf0ccaff,
		text
	);
    return 0;
})

const max = samp.callNative("GetMaxPlayers", "");

samp.callNative("SetGameModeText", "s", "Liked");

console.log(`\n\tMax players: ${max}\n`);

samp.on("OnPlayerConnect", (playerid) => {
    samp.callPublic(
		"UTF8_SendClientMessage",
		"iis",
		playerid,
		0x00ff00ff,
		"você, ação, pão, é, è"
	);

	const name = samp.callNative("GetPlayerName", "iS", 0);
	console.log(name);

})