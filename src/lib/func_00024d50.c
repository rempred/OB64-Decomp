/* Queue and state transitions reconstructed from ROM24D50..24E20. */
#include "common/os_thread.h"

extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int mask);
extern Thread *__osRunningThread;
extern ThreadQueueNode *__osRunQueue;
extern void __osEnqueueThread(ThreadQueueNode **queue, Thread *thread);

void func_00024d50(Thread *thread, int priority)
{
    unsigned int status = __osDisableInt();
    if (thread == 0)
        thread = __osRunningThread;
    if (thread->queue_node.priority != priority) {
        thread->queue_node.priority = priority;
        if (thread != __osRunningThread && thread->state != 1) {
            __osDequeueThread(thread->queue, thread);
            __osEnqueueThread(thread->queue, thread);
        }
        if (__osRunningThread->queue_node.priority < __osRunQueue->priority) {
            __osRunningThread->state = 2;
            __osEnqueueAndYield(&__osRunQueue);
        }
    }
    __osRestoreInt(status);
}
