#include "common/os_message_queue.h"
#include "game/nu_sc_client.h"

typedef signed char s8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
typedef s16 NUScMsg;
extern OSMesgQueue D_800C4C28;
extern OSMesg D_800BE1A0[];
extern void (*D_800AA090)(u32);
extern void (*D_800AA094)(void);
extern u32 D_800E79A4;
void func_0001b3e0(void *arg) {
    NUScClient gfxClient;
    OSMesg message;
    NUScMsg *mesg_type;
    osCreateMesgQueue(&D_800C4C28, D_800BE1A0, 8);
    func_00019454(&gfxClient, &D_800C4C28, 3);
    while (1) {
        func_00023AE0(&D_800C4C28, &message, 1);
        mesg_type = message;
        switch (*mesg_type) {
            case 1:
                if (D_800AA090 != ((void *)0)) {
                    (*D_800AA090)(D_800E79A4);
                }
                break;
            case 2:
                if (D_800AA094 != ((void *)0)) {
                    (*D_800AA094)();
                }
                break;
            default:
                break;
        }
    }
}
