#include <a_samp>
#include <strlib>
#include <samp-node>

new str_buffer[300];

main(){}

forward UTF8_SendClientMessage(playerid, color, const msg[]);
public UTF8_SendClientMessage(playerid, color, const msg[]){
    str_buffer[0] = EOS;
    utf8decode(str_buffer, msg);
    SendClientMessage(playerid, color, str_buffer);
}

forward UTF8_SendClientMessageToAll(playerid, color, const msg[]);
public UTF8_SendClientMessageToAll(playerid, color, const msg[]){
    str_buffer[0] = EOS;
    utf8decode(str_buffer, msg);
    SendClientMessageToAll(color, str_buffer);
}

public OnPlayerText(playerid, text[]){
    str_buffer[0] = EOS;
    utf8encode(str_buffer, text);
    return SAMPNode_CallEvent("UTF8_OnPlayerText", playerid, str_buffer);
}

public OnPlayerCommandText(playerid, cmdtext[]){
    str_buffer[0] = EOS;
    utf8encode(str_buffer, cmdtext);
    return SAMPNode_CallEvent("UTF8_OnPlayerCommandText", playerid, str_buffer);
}