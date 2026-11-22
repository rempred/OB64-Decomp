/* Independently reconstructed from ROM 23AE0..23C10 and its callees. */
#include "common/os_message_queue.h"

extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int mask);
extern Thread *__osRunningThread;

int osRecvMesg(MessageQueue *queue, void **message, int flags)
{
    unsigned int mask = __osDisableInt();

    while (queue->valid_count == 0) {
        if (flags == 0) {
            __osRestoreInt(mask);
            return -1;
        }
        __osRunningThread->state = 8;
        __osEnqueueAndYield(&queue->receive_waiters);
    }
    if (message != 0) {
        *message = queue->messages[queue->first];
    }
    queue->first = (queue->first + 1) % queue->capacity;
    queue->valid_count--;
    if (queue->send_waiters->next != 0) {
        osStartThread((Thread *)__osPopThread(&queue->send_waiters));
    }
    __osRestoreInt(mask);
    return 0;
}
