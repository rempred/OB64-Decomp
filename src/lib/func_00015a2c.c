#include "common/os_message_queue.h"

typedef signed int s32;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
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
typedef struct Scheduler Scheduler;
extern Scheduler *D_800B18A0;
extern MusSchedData *D_800B18A4;
void *func_00015edc(s32 size);
void func_000241f8(Scheduler *sc, OSScClient *c, MessageQueue *queue);
void func_00015a2c(void) {
    D_800B18A4 = func_00015edc(sizeof(MusSchedData));
    osCreateMesgQueue(&D_800B18A4->msgQ, D_800B18A4->msgbuf, 4);
    osCreateMesgQueue(&D_800B18A4->taskQ, D_800B18A4->taskbuf, 4);
    func_000241f8(D_800B18A0, &D_800B18A4->client, &D_800B18A4->msgQ);
}
