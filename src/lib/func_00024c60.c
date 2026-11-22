/* Saved-context offsets and initialization derived from ROM24C60..24D50. */
#include "common/os_thread.h"

extern void __osCleanupThread(void);
extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int status);
extern ThreadQueueNode *__osActiveQueue;
extern Thread *__osRunningThread;

void func_00024C60(Thread *thread, int id, ThreadEntry entry, void *argument,
                  void *stack, int priority)
{
    unsigned int status;
    thread->id = id;
    thread->queue_node.next = 0;
    thread->queue = 0;
    thread->entry = entry;
    thread->argument = (long long)argument;
    thread->queue_node.priority = priority;
    thread->stack = (long long)stack - 16;
    thread->return_address = (long long)__osCleanupThread;
    thread->status = 0xFF03;
    thread->rcp_mask = 0x3F;
    thread->fp_control = 0x01000800;
    thread->fp = 0;
    thread->state = 1;
    thread->flags = 0;
    status = __osDisableInt();
    thread->active_next = __osActiveQueue;
    __osActiveQueue = &thread->queue_node;
    __osRestoreInt(status);
}

static int func_00024D30(Thread *thread)
{
    if (thread == 0)
        thread = __osRunningThread;
    return thread->queue_node.priority;
}
