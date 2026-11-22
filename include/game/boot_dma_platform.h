#ifndef OB64_GAME_BOOT_DMA_PLATFORM_H
#define OB64_GAME_BOOT_DMA_PLATFORM_H

#include "common/types.h"

typedef struct MessageThread MessageThread;

typedef struct MessageQueue {
    MessageThread *receive_waiters;
    MessageThread *send_waiters;
    int valid_count;
    int first;
    int capacity;
    void **messages;
} MessageQueue;

typedef struct DmaIoMessage {
    unsigned short type;
    unsigned char priority;
    unsigned char status;
    void *return_queue;
    void *dram_address;
    unsigned int device_address;
    unsigned int size;
    void *device_handle;
} DmaIoMessage;

struct OSPiHandle_s;

void func_00023970(MessageQueue *queue, void **messages, int capacity);
void osCreateMesgQueue(MessageQueue *queue, void **messages, int capacity);
int func_00023AE0(MessageQueue *queue, void **message, int flags);
int func_0001c040(void *handle, DmaIoMessage *message, int direction);
int D_8008BC40(void *handle, DmaIoMessage *message, int direction);

#endif
