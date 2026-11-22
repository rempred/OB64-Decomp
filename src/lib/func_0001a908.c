#include "game/nu_si_message.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef struct {
    u16 button;
    s8 stick_x;
    s8 stick_y;
    u8 errno;
} OSContPad;
s32 func_0001a7a4(OSContPad *pad, u32 lockflag);
s32 func_0001a908(NUSiCommonMesg *mesg) {
    return func_0001a7a4(mesg->dataPtr, 0);
}
