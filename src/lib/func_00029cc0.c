#include "common/os_pi_manager.h"

MessageQueue *func_00029cc0(void)
{
    if (!D_800AA400.active)
        return 0;
    return D_800AA400.command_queue;
}
