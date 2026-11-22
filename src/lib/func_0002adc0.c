/* Complete thread removal routine reconstructed from ROM2ADC0..2AEA0. */
#include "common/os_thread.h"

extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int status);
extern Thread *__osRunningThread;
extern ThreadQueueNode *__osActiveQueue;
extern void __osDispatchThread(void);

void func_0002adc0(Thread *thread)
{
    unsigned int status = __osDisableInt();
    ThreadQueueNode *previous;
    if (thread == 0)
        thread = __osRunningThread;
    else if (thread->state != 1)
        __osDequeueThread(thread->queue, thread);
    if (__osActiveQueue == (ThreadQueueNode *)thread)
        __osActiveQueue = thread->active_next;
    else {
        previous = __osActiveQueue;
        /* A sentinel has a priority but no active-list link. */
        while (previous->priority != -1) {
            if (((Thread *)previous)->active_next == (ThreadQueueNode *)thread) {
                ((Thread *)previous)->active_next = thread->active_next;
                break;
            }
            previous = ((Thread *)previous)->active_next;
        }
    }
    if (thread == __osRunningThread)
        __osDispatchThread();
    __osRestoreInt(status);
}
