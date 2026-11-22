#include "common/os_thread.h"

typedef unsigned long long u64;
extern Thread D_800BE1C0;
extern u64 D_800C2370[];
void func_0001b3e0(void *arg);
void func_0001b4b0(void) {
    osCreateThread(&D_800BE1C0, 4, func_0001b3e0, ((void *)0), D_800C2370, 0x32);
    osStartThread(&D_800BE1C0);
}
