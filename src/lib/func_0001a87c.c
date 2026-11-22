#include "common/os_message_queue.h"
#include "game/nu_si_message.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
typedef struct {
    u16 button;
    s8 stick_x;
    s8 stick_y;
    u8 errno;
} OSContPad;
extern OSMesgQueue D_800C4A00;
extern u32 D_800C4B30;
extern OSContPad D_800C4BF0[4];
extern void (*D_800A9FE0)(u32);
s32 func_0001a7a4(OSContPad *pad, u32 lockflag);
s32 func_0001a87c(NUSiCommonMesg *mesg) {
    if (D_800C4B30) {
        return 0;
    }
    func_00023AE0(&D_800C4A00, ((void *)0), 0);
    func_0001a7a4(D_800C4BF0, 1);
    if (D_800A9FE0) {
        (*D_800A9FE0)(mesg->mesg);
    }
    func_00023C10(&D_800C4A00, ((void *)0), 0);
    return 0;
}
