#ifndef OB64_COMMON_OS_MESSAGE_QUEUE_H
#define OB64_COMMON_OS_MESSAGE_QUEUE_H

#include "common/os_thread.h"

typedef struct MessageQueue {
    ThreadQueueNode *receive_waiters;
    ThreadQueueNode *send_waiters;
    int valid_count;
    int first;
    int capacity;
    void **messages;
} MessageQueue;

void func_00023970(MessageQueue *queue, void **messages, int capacity);
void osCreateMesgQueue(MessageQueue *queue, void **messages, int capacity);
int func_00023AE0(MessageQueue *queue, void **message, int flags);
int osRecvMesg(MessageQueue *queue, void **message, int flags);
int func_00023C10(MessageQueue *queue, void *message, int flags);
int osSendMesg(MessageQueue *queue, void *message, int flags);
int osJamMesg(MessageQueue *queue, void *message, int flags);

#endif
