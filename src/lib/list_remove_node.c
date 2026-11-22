/* Pointer-to-link traversal follows ROM25000..25034; native tail is preserved. */
#include "common/os_thread.h"

void func_00025000(ThreadQueueNode **head, Thread *thread)
{
    ThreadQueueNode **link = head;
    ThreadQueueNode *current = *link;
    while (current != 0) {
        if (current == (ThreadQueueNode *)thread) {
            *link = current->next;
            return;
        }
        link = &current->next;
        current = *link;
    }
}
