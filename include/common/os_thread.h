#ifndef OB64_COMMON_OS_THREAD_H
#define OB64_COMMON_OS_THREAD_H

typedef struct Thread Thread;
typedef void (*ThreadEntry)(void *);

/* The eight-byte queue sentinel and a live thread share this prefix. */
typedef struct ThreadQueueNode {
    struct ThreadQueueNode *next;
    int priority;
} ThreadQueueNode;

/* Creation and dispatch share this saved context. The final register save
 * uses the slot at +0x1A8, so embedded thread storage extends to +0x1B0. */
struct Thread {
    ThreadQueueNode queue_node;
    ThreadQueueNode **queue;
    ThreadQueueNode *active_next;
    unsigned short state;
    unsigned short flags;
    int id;
    int fp;
    unsigned char unknown_1c[0x1C];
    long long argument;
    unsigned char unknown_40[0xB0];
    long long stack;
    long long unknown_f8;
    long long return_address;
    unsigned char unknown_108[0x10];
    unsigned int status;
    ThreadEntry entry;
    unsigned int unknown_120[2];
    unsigned int rcp_mask;
    unsigned int fp_control;
    unsigned long long saved_fp[16];
};

typedef char ThreadSizeCheck[sizeof(Thread) == 0x1B0 ? 1 : -1];

void func_00024C60(Thread *thread, int id, ThreadEntry entry, void *argument,
                  void *stack, int priority);
void osCreateThread(Thread *thread, int id, ThreadEntry entry, void *argument,
                    void *stack, int priority);
void func_00024e20(Thread *thread);
void func_00024E20(Thread *thread);
void osStartThread(Thread *thread);

void __osEnqueueAndYield(ThreadQueueNode **queue);
ThreadQueueNode *__osPopThread(ThreadQueueNode **queue);
void func_00025000(ThreadQueueNode **queue, Thread *thread);
void __osDequeueThread(ThreadQueueNode **queue, Thread *thread);

#endif
