/* Independently reconstructed from ROM 239A0..23AE0 and its callees. */
#include "common/os_message_queue.h"

extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int mask);
extern Thread *__osRunningThread;

int osJamMesg(MessageQueue *queue, void *message, int flags)
{
    unsigned int mask = __osDisableInt();

    while (queue->valid_count >= queue->capacity) {
        if (flags != 1) {
            __osRestoreInt(mask);
            return -1;
        }
        __osRunningThread->state = 8;
        __osEnqueueAndYield(&queue->send_waiters);
    }
    queue->first = (queue->first + queue->capacity - 1) % queue->capacity;
    queue->messages[queue->first] = message;
    queue->valid_count++;
    if (queue->receive_waiters->next != 0) {
        osStartThread((Thread *)__osPopThread(&queue->receive_waiters));
    }
    __osRestoreInt(mask);
    return 0;
}
