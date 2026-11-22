/* Complete state switch reconstructed from ROM24F40..25000. */
#include "common/os_thread.h"

extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int mask);
extern Thread *__osRunningThread;

void func_00024f40(Thread *thread)
{
    unsigned int status = __osDisableInt();
    unsigned short state = thread == 0 ? 4 : thread->state;
    switch (state) {
    case 4:
        __osRunningThread->state = 1;
        __osEnqueueAndYield(0);
        break;
    case 2:
    case 8:
        thread->state = 1;
        __osDequeueThread(thread->queue, thread);
        break;
    }
    __osRestoreInt(status);
}
