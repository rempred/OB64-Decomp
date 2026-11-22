#include "common/os_message_queue.h"

typedef signed char s8;
typedef signed short s16;
typedef signed int s32;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
typedef struct {
    s16 type;
    s8 misc[30];
} OSScMsg;
typedef struct Client {
    struct Client *next;
    MessageQueue *queue;
} OSScClient;
typedef struct {
    OSScClient client;
    OSMesgQueue msgQ;
    OSMesg msgbuf[4];
    OSMesgQueue taskQ;
    OSMesg taskbuf[4];
} MusSchedData;
extern MusSchedData *D_800B18A4;
void func_00015a90(void) {
    OSMesg msg;
    do {
        func_00023AE0(&D_800B18A4->msgQ, &msg, 1);
        func_00023AE0(&D_800B18A4->msgQ, ((void *)0), 0);
    } while (((OSScMsg *)msg)->type != 1);
}
