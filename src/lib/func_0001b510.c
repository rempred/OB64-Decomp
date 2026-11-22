#include "common/task_framebuffer.h"
void osViSwapBuffer(void *frameBufPtr);
void func_0001b510(NUScTask *gfxTask) {
    osViSwapBuffer(gfxTask->framebuffer);
}
