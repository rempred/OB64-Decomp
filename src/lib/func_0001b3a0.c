#include "common/task_framebuffer.h"
extern void (*D_800A9E8C)(NUScTask *);
u32 osSetIntMask(u32 mask);
void func_0001b3a0(void (*func)(NUScTask *)) {
    u32 mask;
    mask = osSetIntMask(1);
    D_800A9E8C = func;
    osSetIntMask(mask);
}
