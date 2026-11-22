#ifndef OB64_GAME_BOOT_DMA_PLATFORM_H
#define OB64_GAME_BOOT_DMA_PLATFORM_H

#include "common/types.h"
#include "common/os_message_queue.h"

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

int func_0001c040(void *handle, DmaIoMessage *message, int direction);
int D_8008BC40(void *handle, DmaIoMessage *message, int direction);

#endif
