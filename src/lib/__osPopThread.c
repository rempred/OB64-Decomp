#include "common/os_thread.h"

ThreadQueueNode *__osPopThread(ThreadQueueNode **queue)
{
    ThreadQueueNode *head = *queue;
    register ThreadQueueNode *next asm("$25") = head->next;

    *queue = next;
    return head;
}
