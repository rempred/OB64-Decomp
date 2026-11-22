/* State store and queue yield reconstructed from ROM25040..25090. */
#include "common/os_thread.h"

extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int mask);
extern Thread *__osRunningThread;
extern ThreadQueueNode *__osRunQueue;

void func_00025040(void)
{
    unsigned int status = __osDisableInt();
    __osRunningThread->state = 2;
    __osEnqueueAndYield(&__osRunQueue);
    __osRestoreInt(status);
}
