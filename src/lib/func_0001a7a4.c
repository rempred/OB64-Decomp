#include "common/os_message_queue.h"

typedef signed char s8;
typedef unsigned char u8;
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
extern OSMesgQueue D_800E9B88;
extern u32 D_800C4B30;
s32 func_00020690(void *queue);
void func_00020718(OSContPad *pad);
void D_8008A354(void);
void func_0001a77c(void);
s32 func_0001a7a4(OSContPad *pad, u32 lockflag);
void D_8008A354(void);
void func_0001a77c(void);
s32 func_0001a7a4(OSContPad *pad, u32 lockflag) {
    s32 rtn;
    rtn = func_00020690(&D_800E9B88);
    if (rtn) {
        return rtn;
    }
    func_00023AE0(&D_800E9B88, ((void *)0), 1);
    if (lockflag & D_800C4B30) {
        return rtn;
    }
    D_8008A354();
    func_00020718(pad);
    func_0001a77c();
    return rtn;
}
