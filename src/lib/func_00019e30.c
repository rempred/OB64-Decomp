#include "common/os_message_queue.h"
#include "game/nu_sc_client.h"

typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
void func_00019e30(u32 retrace_num) {
    NUScClient client;
    OSMesgQueue mesgQ;
    OSMesg mesgBuf;
    osCreateMesgQueue(&mesgQ, &mesgBuf, 1);
    func_00019454(&client, &mesgQ, 1);
    while (retrace_num) {
        func_00023AE0(&mesgQ, ((void *)0), 1);
        retrace_num--;
    }
    func_00019524(&client);
}
