#include "common/os_pi_manager.h"

#include "common/event_message.h"

extern Thread D_800C2380;
extern unsigned char D_800C2530[4096];
extern MessageQueue D_800C3530, __osPiAccessQueue;
extern void *D_800C3548[1];
extern int __osPiAccessQueueEnabled;
extern void __osPiCreateAccessQueue(void);
extern int osGetThreadPri(Thread *);
extern void osSetThreadPri(Thread *, int);
extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int);
extern void __osDevMgrMain(void *);
extern int __osPiRawStartDma(int, unsigned int, void *, unsigned int);

void func_0001bcc0(int priority, MessageQueue *queue, void **messages, int count)
{
    int oldPriority;
    int currentPriority;
    unsigned int mask;
    if (D_800AA400.active)
        return;
    osCreateMesgQueue(queue, messages, count);
    osCreateMesgQueue(&D_800C3530, D_800C3548, 1);
    if (!__osPiAccessQueueEnabled)
        __osPiCreateAccessQueue();
    osSetEventMesg(8, &D_800C3530, (void *)0x22222222);
    oldPriority = -1;
    currentPriority = osGetThreadPri(0);
    if (currentPriority < priority) {
        oldPriority = currentPriority;
        osSetThreadPri(0, priority);
    }
    mask = __osDisableInt();
    D_800AA400.active = 1;
    D_800AA400.thread = &D_800C2380;
    D_800AA400.command_queue = queue;
    D_800AA400.event_queue = &D_800C3530;
    D_800AA400.access_queue = &__osPiAccessQueue;
    D_800AA400.dma = __osPiRawStartDma;
    D_800AA400.epi_dma = __osEPiRawStartDma;
    osCreateThread(&D_800C2380, 0, __osDevMgrMain, &D_800AA400,
                   D_800C2530 + sizeof(D_800C2530), priority);
    osStartThread(&D_800C2380);
    __osRestoreInt(mask);
    if (oldPriority != -1)
        osSetThreadPri(0, oldPriority);
}
