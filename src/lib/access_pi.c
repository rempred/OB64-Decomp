#include "common/os_message_queue.h"

extern MessageQueue D_800C4CC8;
extern void *D_800C3550[];
extern int D_800AA440;

/* The callable initializer is also embedded in the access acquisition body. */
__inline__ void func_0001c670(void)
{
    D_800AA440 = 1;
    osCreateMesgQueue(&D_800C4CC8, D_800C3550, 1);
    osSendMesg(&D_800C4CC8, 0, 0);
}

void func_0001c6c4(void)
{
    void *message;
    if (!D_800AA440)
        func_0001c670();
    osRecvMesg(&D_800C4CC8, &message, 1);
}

void func_0001c730(void)
{
    osSendMesg(&D_800C4CC8, 0, 0);
}
