#include "common/event_message.h"
#include "common/os_message_queue.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef struct {
    u16 type;
    u8 status;
    u8 error;
} OSContStatus;
extern MessageQueue D_800E9B88;
extern OSMesg D_800BBE60[];
extern Thread D_800BBE80;
extern MessageQueue D_800BE030;
s32 func_00020870(MessageQueue *mq, u8 *bitpattern, OSContStatus *status);
void func_0001a19c(void *arg);
u8 func_0001a060(void) {
    u8 pattern;
    OSContStatus status[4];
    osCreateMesgQueue(&D_800E9B88, D_800BBE60, 8);
    osSetEventMesg(5, &D_800E9B88, 0);
    func_00020870(&D_800E9B88, &pattern, status);
    osCreateThread(&D_800BBE80, 5, func_0001a19c, ((void *)0), &D_800BE030, 0x73);
    osStartThread(&D_800BBE80);
    return pattern;
}
void func_0001a19c(void *arg);
