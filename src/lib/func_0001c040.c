#include "common/os_pi_manager.h"
#include "game/boot_dma_platform.h"

int func_0001c040(void *handle, DmaIoMessage *message, int direction)
{
    int result;
    if (!D_800AA400.active)
        return -1;
    message->device_handle = handle;
    if (direction == 0)
        message->type = 15;
    else
        message->type = 16;
    if (message->priority == 1)
        result = osJamMesg(func_00029cc0(), message, 0);
    else
        result = osSendMesg(func_00029cc0(), message, 0);
    return result;
}
