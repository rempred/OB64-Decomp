#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
inline s32 func_0020C2C0(void *u) {
    if (u == ((void *)0)) {
        return 1;
    }
    return (*(u32 *)((u8 *)u + 0x40)) & 1;
}
