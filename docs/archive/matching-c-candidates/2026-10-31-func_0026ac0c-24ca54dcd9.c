#include "common/types.h"

struct Func0026A6E4State;

extern void func_00023780(void *target, u32 bytes);
extern void *func_0020D778(void *callback);
extern u32 func_0026a6e4(u16 command, struct Func0026A6E4State *state);
extern volatile u16 g_func_00269470_flags;
extern void * volatile g_func_00269470_value_3C;

void *func_0026ac0c(s32 argument)
{
    func_00023780((void *)&g_func_00269470_flags, 0x18);
    g_func_00269470_flags = 0x20;
    g_func_00269470_value_3C = (void *)argument;
    return func_0020D778((void *)func_0026a6e4);
}
