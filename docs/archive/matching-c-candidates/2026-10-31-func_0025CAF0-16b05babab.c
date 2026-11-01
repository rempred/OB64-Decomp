#include "common/types.h"
extern u32 func_0024BCA0(u32);
extern void func_0020DF00(const void *);
extern volatile u8 g_func_0025CAF0_value_68;
extern volatile u8 g_func_0025CAF0_value_70;
extern volatile u8 g_func_0025CAF0_value_71;
extern unsigned char g_func_0025CAF0_message[];

void func_0025CAF0(u8 value, u32 value_70, u32 value_71)
{
    if ((s16)func_0024BCA0(value & 255) == 0) {
        g_func_0025CAF0_value_68 = value;
        g_func_0025CAF0_value_71 = value_71;
        g_func_0025CAF0_value_70 = value_70;
        func_0020DF00(g_func_0025CAF0_message);
    }
}
