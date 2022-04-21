import "./handlers";

samp.registerEvent("UTF8_OnPlayerText", "is");
samp.registerEvent("UTF8_OnPlayerCommandText", "is");

samp.on("UTF8_OnPlayerText", (playerid, text) => {
    console.log(
        `${samp.callNative("GetPlayerName", "i", playerid)} say: ${text}.`
    );

    samp.callPublic(
        "UTF8_SendClientMessage",
        "iis",
        playerid,
        0xbf0ccaff,
        text
    );
	
    return 0;
});
