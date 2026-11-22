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
    u16 type;
    u8 status;
    u8 errno;
} OSContStatus;
extern OSMesgQueue D_800E9B88;
extern OSContStatus D_800C4B38[4];
s32 func_000205f0(void *queue);
void func_00020670(void *status);
s32 func_0001a82c(NUSiCommonMesg *mesg) {
    s32 rtn;
    rtn = func_000205f0(&D_800E9B88);
    if (rtn) {
        return rtn;
    }
    func_00023AE0(&D_800E9B88, ((void *)0), 1);
    func_00020670(D_800C4B38);
    return rtn;
}
