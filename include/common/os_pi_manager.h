#ifndef OB64_COMMON_OS_PI_MANAGER_H
#define OB64_COMMON_OS_PI_MANAGER_H

#include "common/os_message_queue.h"
#include "common/os_pi_handle.h"

typedef struct PiManager {
    int active;
    Thread *thread;
    MessageQueue *command_queue;
    MessageQueue *event_queue;
    MessageQueue *access_queue;
    int (*dma)(int, unsigned int, void *, unsigned int);
    int (*epi_dma)(OSPiHandle *, int, unsigned int, void *, unsigned int);
} PiManager;

extern PiManager D_800AA400;

MessageQueue *func_00029cc0(void);

#endif
