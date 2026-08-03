typedef unsigned int u32;

typedef struct OSMesgQueue {
    void *thread_queue_00;
    void *thread_queue_04;
    void *message_buffer_08;
    u32 valid_count_0C;
    u32 first_message_10;
    void *message_buffer_14;
} OSMesgQueue;

extern char g_os_thread_queue_sentinel[];

void func_00023970(OSMesgQueue *queue, void *message, u32 count)
{
    queue->thread_queue_00 = g_os_thread_queue_sentinel;
    queue->thread_queue_04 = g_os_thread_queue_sentinel;
    queue->message_buffer_08 = (void *)0;
    queue->valid_count_0C = 0;
    queue->first_message_10 = count;
    queue->message_buffer_14 = message;
}

asm(".space 12");
asm(".size func_00023970, 48");
